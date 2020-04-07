import {Document, Schema, model} from 'mongoose'

export type TaskDocument = Document & {
    title: String;
    //위도 경도 저장
    coordinates: [Number, Number]
    //tags 배열로 담는거에요?
    tags: String;
    memo: String;
    iconURL: String;
    isFinished: Boolean;
    dueDate: Date;
};

const TaskSchema: Schema = new Schema({
    title:{
        type: String,
        required: false,
        // 어플의 방향성에 맞게 Random default title 필요.
        default : 'untitled'
    },
    coordinates:{
        type: [Number, Number],
        //좌표값은 필수 
        required: true
    },
    tags:{
        type: String,
        required: false
    },
    memo:{
        type: String,
        required: false,
        default: '-'
    },
    iconURL:{
        type:String,
        required: false,
        //default:
    },
    isFinished:{
        type: Boolean,
        required: true
    },
    dueDate:{
        type: Date,
        default: Date.now
    }
});

const User = model<TaskDocument>('Task', TaskSchema);
export default Task;
