export const getId = () => {
    console.log('获取id的函数执行！！！！！')
    let userId = localStorage.getItem('userTempId') || '';
    if(userId) {
       return userId;  
    } else {
        localStorage.setItem('userTempId', Date.now());
    }
}