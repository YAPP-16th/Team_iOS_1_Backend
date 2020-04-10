import {Document, Schema, model} from 'mongoose'

//coordinates 다른 자료 참고하기를 바람.

export type TaskDocument = Document & {
    title: String;
    coordinates: [Number, Number];
    tags: [String];
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

const Task = model<TaskDocument>('Task', TaskSchema);
export default Task;