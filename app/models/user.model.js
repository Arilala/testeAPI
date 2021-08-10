module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      firstname: String,
      lastname: String,
      Email: String,
      Password: String,
      date_naissance: Date,
      sexe: Boolean,
    },
    { timestamps: true },
  )

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const User = mongoose.model('User', schema)
  return User
}
