const bcrypt = require('bcrypt');

const  generateSalt = async () =>{
    const salt =await bcrypt.genSalt(10);
    return salt;
}

const MakePassword = async (value) =>{
    const salt= await generateSalt();
    const hashedPass = await bcrypt.hash(value,salt);
    return hashedPass;
}

const ValidatePass = async (pass,hashed) =>{
    return bcrypt.compare(pass,hashed);
}
module.exports = {
    makePassword : MakePassword,
    validatePass : ValidatePass
};