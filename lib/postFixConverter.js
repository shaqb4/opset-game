class PostFixConverter {
    constructor() {
    }

    convertPostfixToExpressions(postfixArray, target) {
        let opStrings =[];
        var stack = [];
  
        for(let element of postfixArray) {  
            if(!Number.isInteger(element)) {
                if (!Number.isInteger(stack[stack.length - 1]) || !Number.isInteger(stack[stack.length - 2])) {
                    return [];
                }
                var x = stack.pop();
                var y = stack.pop();
                if (element == "+") {
                    stack.push(y + x);
                    if (y < x ) {
                        opStrings.push(`${y} + ${x} = ${y+x}`);
                    } else {
                        opStrings.push(`${x} + ${y} = ${y+x}`);
                    }
                } else if (element == '-') {
                    if (x >= y) {
                        return [];
                    }
                    stack.push(y - x);
                    opStrings.push(`${y} - ${x} = ${y-x}`);
                } else if (element == '*') {
                    stack.push(y * x);
                    if (y < x ) {
                        opStrings.push(`${y} * ${x} = ${y*x}`);
                    } else {
                        opStrings.push(`${x} * ${y} = ${y*x}`);
                    }
                } else if (element == '/') {
                    if (!Number.isInteger(y / x)) {
                        return [];
                    }
                    stack.push(y / x);
                    opStrings.push(`${y} / ${x} = ${y/x}`);
                }
                if (Number.isInteger(target) && stack[stack.length - 1] === target) {
                    return opStrings;
                }
            } else {
                stack.push( element );
            }
        }
        //final check for non numbers within the stack
        var returnValue = null;
        while( stack.length > 0 ){
            var element = stack.pop();  
            if(!Number.isInteger(element)) {
                continue;
            } else {
                returnValue = element;
            }
        }
        // opStrings.push(`Solution is ${returnValue}`);
        return opStrings;
    }
}

export { PostFixConverter };