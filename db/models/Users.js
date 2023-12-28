const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        lowercase:true,
        required:[true,`Une adresse mail est obligatoire`],
        validate: {
            validator: function (value) {
                    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    return emailRegex.test(value);
            },
            message: props => `L'adresse e-mail ${props.value} ne respecte pas le format attendu.`
          },
    },
    password: {
        type: String,
        required:[true,`Un mot de passe est obligatoire`],
        // minlength:[6,`minimum 6 caractères`]
    },
    createdAt: {
        type: Date
    },
});

const saltRounds = 10;

userSchema.pre('save',async function  (next) {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email,password){
        const user = await this.findOne({email});
    if(user){
        const authenticatedUser = await bcrypt.compare(password,user.password);
            if(authenticatedUser) {
                return user;
            }
            throw Error('Mot de passe incorrecte');
    }
    throw Error('Utilisateur non trouvé');
}

userSchema.statics.changepwd = async function (userData = {user_id:"",currentPassword:"",newPassword:""}){
    const user = await this.findOne({_id:userData.user_id});
    if(user){
        const authenticatedUser = await bcrypt.compare(userData.currentPassword,user.password);
        if(authenticatedUser){
            const updateUserData = {
                email:user.email,
                password:await bcrypt.hash(userData.newPassword, await bcrypt.genSalt(saltRounds))
            }
           const currUser = await this.findByIdAndUpdate(userData.user_id,updateUserData,{new:true})
           return currUser;
        }
        throw Error('Mot de passe actuel incorrecte');
    }
}

const User = mongoose.model('users',userSchema);

module.exports = User;