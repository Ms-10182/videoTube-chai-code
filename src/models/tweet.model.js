import mongoose, {Schema} from "mongoose";
import paginate from "mongoose-paginate-v2";
const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

tweetSchema.plugin(paginate)

export const Tweet = mongoose.model("Tweet", tweetSchema)