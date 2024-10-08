import mongoose from "mongoose";
var Role;
(function (Role) {
    Role["student"] = "student";
    Role["teacher"] = "teacher";
})(Role || (Role = {}));
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    passportId: {
        type: String,
        required: [true, "Passport Id is required"],
        minLength: 9,
        maxLength: 9,
        match: /^[0-9]{9}$/
    },
    password: {
        type: String,
        required: [true, "Password required"]
    },
    grades: {
        type: [{ subject: { type: String }, grade: { type: Number } }]
    },
    role: {
        type: Role,
        enum: Object.values(Role),
        required: true
    }
});
UserSchema.methods.calculateAvgGrade = function () {
    if (this.grades.length === 0)
        return 0;
    const sum = this.grades.reduce((total, grade) => total + grade.grade, 0);
    return sum / this.grades.length;
};
export default mongoose.model("User", UserSchema);
