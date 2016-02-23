let data = require('../../lib/data'),
	denodeify = require('denodeify'),
	User = require('../../lib/user');

let compare = denodeify(require('bcrypt').compare);

module.exports = async function login(username, password) {
	let user = new User(username);
	await user.read();
	if (!(await compare(password, user.get('password')))) {
		throw new Error('invalid user/pass');
	}
	await user.update({ last_login: new Date().getTime() });
	let values = await Promise.all(['Foo', 'Bar', 'Quux'].map((t) => data[`query${t}`]()));
	user.set({
		foo: values[0],
		bar: values[1],
		quux: values[2]
	});
	return user;
};
