class PostFixSolver {
    constructor(target) {
        this.target = target;
    }
  
    postfixEval(postfixArray) {
        let stack = [];
  
        for(let element of postfixArray) {
            //  console.log("element: " + element);
  
            if(!Number.isInteger(element)) {
                if (!Number.isInteger(stack[stack.length - 1]) || !Number.isInteger(stack[stack.length - 2])) {
                    return -1;
                }
                var x = stack.pop();
                var y = stack.pop();
                // console.log("var x,y: " + x + " " + y + " element: " + element) ;
                if (element == "+"){
                    // result = (y+x);
                    // console.log("Expected Result: " + result)
                    stack.push(y + x);
                } else if (element == '-') {
                    if (x >= y) {
                        return -1;
                    }
                    stack.push(y - x);
                } else if (element == '*') {
                    stack.push(y * x);
                } else if (element == '/') {
                    if (!Number.isInteger(y / x)) {
                        return -1;
                    }
                    stack.push(y / x);
                }
                if (stack[stack.length - 1] === this.target) {
                    return this.target;
                }
            } else {
                stack.push( element );
            }
        }
        //final check for non numbers within the stack
        var returnValue = null;
        while( stack.length > 0 ){
            // console.log( stack );
            var element = stack.pop();  
            if(!Number.isInteger(element)) {
                continue;
            } else {
                returnValue = element;
            }
        }
        return returnValue;
    }
}

export { PostFixSolver };