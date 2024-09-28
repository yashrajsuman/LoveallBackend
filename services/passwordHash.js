import bcrypt from "bcrypt";

const saltRound = 10;
const hashPassword = async (password) => {
    try {
        const password_hash = await bcrypt.hash(password, saltRound);
        return password_hash;
    }
    catch(error) {
        return new Error("Internal Server error.");
    }
}

const comparePassword = async (password) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        return new Error("Internal Server error.");
    }
}

export {hashPassword, comparePassword};