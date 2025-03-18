import requests
import base64
import json
import pyaes
import binascii
from datetime import datetime

# API请求参数
api_url = 'http://api.skrapp.net/api/serverlist'
headers = {
    'accept': '/',
    'accept-language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
    'appversion': '1.3.1',
    'user-agent': 'SkrKK/1.3.1 (iPhone; iOS 13.5; Scale/2.00)',
    'content-type': 'application/x-www-form-urlencoded',
    'Cookie': 'PHPSESSID=fnffo1ivhvt0ouo6ebqn86a0d4'
}
payload = {'data': '4265a9c353cd8624fd2bc7b5d75d2f18b1b5e66ccd37e2dfa628bcb8f73db2f14ba98bc6a1d8d0d1c7ff1ef0823b11264d0addaba2bd6a30bdefe06f4ba994ed'}
key = b'65151f8d966bf596'
iv = b'88ca0f0ea1ecf975'

# AES解密函数
def aes_decrypt(data, key, iv):
    cipher = pyaes.AESModeOfOperationCBC(key, iv=iv)
    decrypted = b''.join(cipher.decrypt(data[i:i+16]) for i in range(0, len(data), 16))
    return decrypted[:-decrypted[-1]]  # 去除填充字节

# 发送请求并处理响应
try:
    response = requests.post(api_url, headers=headers, data=payload)
    response.raise_for_status()  # 检查请求是否成功
    hex_data = response.text.strip()
    binary_data = binascii.unhexlify(hex_data)
    decrypted_data = aes_decrypt(binary_data, key, iv)
    server_list = json.loads(decrypted_data)

    # 生成并打印Shadowsocks链接
    for server in server_list['data']:
        ss_link = f"aes-256-cfb:{server['password']}@{server['ip']}:{server['port']}"
        encoded_link = base64.b64encode(ss_link.encode('utf-8')).decode('utf-8')
        final_link = f"ss://{encoded_link}#{server['title']}"
        print(final_link)

    print("所有 Shadowsocks 链接已生成。按回车键关闭脚本。")
    input()  # 等待用户按回车键

except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
except Exception as e:
    print(f"处理过程中发生错误: {e}")
