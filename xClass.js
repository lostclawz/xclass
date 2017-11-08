import {
	isFunction,
	isArray,
	isPlainObject,
	isUndefined,
	isNull,
	isString,
	isBoolean,
	sortedUniq,
	compact,
	chain
} from 'lodash';


export default function xClass(...args){

	let classes = args.reduce((prev, curr) => {
		if (isPlainObject(curr)){
			// combine class/predicate pairs into an array
			let cs = [];
			for (let key in curr){
				if (isFunction(curr[key])){
					if (curr[key]()){
						cs.push(key);
					}
				}
				else if (isBoolean(curr[key])){
					if (curr[key]){
						cs.push(key);
					}
				}
				else if (isPlainObject(curr[key])){
					cs.push(xClass(curr[key]));
				}
			}
			return prev.concat(cs);
		}
		else if (isArray(curr)){
			// recursively iterate over array elements
			return prev.concat(
				curr.reduce(
					(l, c) => l.concat(xClass(c)), []
				)
			);
		}
		else if (isString(curr)){
			return prev.concat(curr);
		}
		else if (isFunction(curr)){
			// recursively apply function's return
			return prev.concat(xClass(curr()));
		}
		else {
			return prev;
		}
	}, []);

	return chain(classes)
		.compact()
		.sort()
		.sortedUniq()
		.value()
		.join(' ');
		
}

module.exports = xClass;