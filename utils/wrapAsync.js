module.exports = (fn)=>{
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    };
};
// this wrapAsync concept is used to reduce the heavy usage of  
//try block and reduce the usage of bulky code