import json
import os
import psycopg2
import random
import string
from datetime import datetime, timedelta
from typing import Dict, Any

def generate_code() -> str:
    return ''.join(random.choices(string.digits, k=6))

def send_email(email: str, code: str) -> bool:
    import requests
    
    api_key = os.environ.get('RESEND_API_KEY')
    if not api_key:
        raise ValueError('RESEND_API_KEY not configured')
    
    response = requests.post(
        'https://api.resend.com/emails',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'from': 'Mixsønαr <onboarding@resend.dev>',
            'to': [email],
            'subject': f'Ваш код для входа: {code}',
            'html': f'''
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="background: linear-gradient(135deg, #9b87f5, #d946ef, #f97316); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        Mixsønαr
                    </h1>
                    <p style="font-size: 16px; color: #333;">Ваш код для входа:</p>
                    <h2 style="font-size: 36px; letter-spacing: 8px; color: #9b87f5; 
                               font-weight: bold; margin: 20px 0;">{code}</h2>
                    <p style="font-size: 14px; color: #666;">
                        Код действителен 10 минут.<br>
                        Если вы не запрашивали код, проигнорируйте это письмо.
                    </p>
                </div>
            '''
        }
    )
    
    return response.status_code == 200

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            raise ValueError('DATABASE_URL not configured')
        
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if action == 'request_code':
            email = body.get('email', '').strip().lower()
            if not email or '@' not in email:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Некорректный email'})
                }
            
            cur.execute(
                "INSERT INTO users (email) VALUES (%s) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id",
                (email,)
            )
            user_id = cur.fetchone()[0]
            
            code = generate_code()
            expires_at = datetime.utcnow() + timedelta(minutes=10)
            
            cur.execute(
                "INSERT INTO auth_codes (user_id, code, expires_at) VALUES (%s, %s, %s)",
                (user_id, code, expires_at)
            )
            conn.commit()
            
            send_email(email, code)
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'success': True, 'message': 'Код отправлен на email'})
            }
        
        elif action == 'verify_code':
            email = body.get('email', '').strip().lower()
            code = body.get('code', '').strip()
            
            if not email or not code:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и код обязательны'})
                }
            
            cur.execute(
                """
                SELECT ac.id, ac.user_id, u.email 
                FROM auth_codes ac
                JOIN users u ON u.id = ac.user_id
                WHERE u.email = %s AND ac.code = %s AND ac.used = FALSE AND ac.expires_at > NOW()
                ORDER BY ac.created_at DESC
                LIMIT 1
                """,
                (email, code)
            )
            
            result = cur.fetchone()
            
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный или истекший код'})
                }
            
            auth_code_id, user_id, user_email = result
            
            cur.execute("UPDATE auth_codes SET used = TRUE WHERE id = %s", (auth_code_id,))
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user_id,
                        'email': user_email
                    }
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unknown action'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
