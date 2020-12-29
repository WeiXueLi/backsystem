import Vue from "vue"
let vm = new Vue()


export let successalert = (msg)=>{
    vm.$message({
        message:msg,
        type:"success"
    });
}

export let erroralert = (msg)=>{
    vm.$message({
        message:msg,
        type:"warning"
    });
}