import { userModel } from '../models/user.js'
import { hash, compare, hashSync, compareSync } from "bcryptjs"


export async function addUser(req, res) {  //כדאי לקרוא לזה sigh up?
    if (!req.body)
        return res.status(400).json({ title: "Missing body", message: "No data" })
    let { userName, email, password } = req.body
    if (!userName || !password || !email)
        return res.status(400).json({ title: "Missing data", message: "Username, password, email are required" })
    //כאן המקום לבדוק שהסיסמא במבנה תקין וכן המייל
    //וכן בדיקה מה קורה כמוסיפים יוזר שכבר קיים אבל הוא בסטטוס לא פעיל
    let already = await userModel.findOne({ email }) //status:true
    if (already)
        return res.status(409).json({ title: "duplicate user", message: "a user with the same email already exists" })
    try {
        let hashedPassword = hashSync(password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10)
        // console.log(hashedPassword);
        let newUser = new userModel({ userName, password: hashedPassword, email })
        let user = await newUser.save()
        try {
            let { password, ...other } = user.toObject();

            return res.status(201).json(other)
        }
        catch (err) {
            return res.status(500).json({ title: "Error creating user", message: err })
        }
    }
    catch (err) {
        return res.status(500).json({ title: "Error creating user", message: err })
    }
}

export async function login(req, res) {
    if (!req.body)
        return res.status(400).json({ title: "missing body", message: "no data" })
    try {
        let { email, password: pass } = req.body
        if (!email || !pass) //אם גם השם הוא פרמטר חובה יש לבדוק גם אותו?
            return res.status(400).json({ title: "missing data", message: "email, password are required" })
        let user = await userModel.findOne({ email, status: true })
        if (!user)
            return res.status(404).json({ title: "invalid credentials", message: "email is incorrect" })

        let isMatch = compareSync(pass, user.password)//משווה את הסיסמא שהמתשמש מנסה להכנס איתה לבין הסיסמא המוצפנת במסד הנתונים
        if (!isMatch)
            return res.status(404).json({ title: "invalid credentials", message: "password is incorrect" })

        let { password, ...other } = user.toObject();

        return res.json(other)
    }
    catch (err) {
        return res.status(500).json({ title: "Error logging in", message: err })
    }
}

export async function getUsers(req, res) {
    try {
        let users = await userModel.find({ role:'PATIENT',status: true });
        return res.json(users);
    }
    catch (err) {
        return res.status(500).json({ title: "Error retrieving users", massage: err })
    }
}

//function getDoctors

//כמובן שאפשר להוסיך פעולות עדכון סיסמא עדגכון כל הפרטים