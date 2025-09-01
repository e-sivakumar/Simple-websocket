const bcrypt = require("bcrypt");

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

module.exports = {
    hashPassword: async (password)=>{
        try {
            const hashed = await bcrypt.hash(password, saltRounds);
            return hashed;
        } catch (err) {
            console.error("Error hashing password:", err);
            return null;
        }
    },
    comparePassword: async (password, hashedPassword) => {
        try {
            const result = await bcrypt.compare(password, hashedPassword);
            return result;
        } catch (err) {
            console.error("Error comparing passwords:", err);
            return false;
        }
    }
}


