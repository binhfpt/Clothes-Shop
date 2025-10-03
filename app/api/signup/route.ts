import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/app/helpers/mailer";

connect()

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, phone } = await request.json();

        //TODO: validation
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({ error: "already existed", status: 400 })
        }
        const salt = await bcrypt.genSalt(10)
        var hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashPassword,
            phone
        })
        const savedUser = await newUser.save()

        //Sent verify email
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

        return NextResponse.json({ message: "Registered, pls VERIFY your email.", success: true, savedUser }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}