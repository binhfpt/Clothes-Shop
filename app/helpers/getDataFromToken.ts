import { NextRequest } from 'next/server'
import jwt from "jsonwebtoken"
const GetDataFromToken = (req: NextRequest) => {
    const token = req.cookies.get("token")?.value || ""
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!)
    return decodedToken.id
}

export default GetDataFromToken