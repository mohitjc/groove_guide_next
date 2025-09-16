
const env=process.env as any
const envirnment={
    app_name:(env.NEXT_PUBLIC_APP_NAME||'my app').replaceAll(' ','_'),
    secret_key:env.NEXT_PUBLIC_SEKRET_KEY,
    api:env.NEXT_PUBLIC_API_URL,
    userRoleId:env.NEXT_PUBLIC_USER_ROLE_ID,
    joinUrl:'https://joincraftclub.com/membership',
    image_path:env.NEXT_PUBLIC_IMAGE_PATH,
    googleClientId:env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
}
export default envirnment