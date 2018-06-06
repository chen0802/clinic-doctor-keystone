function get (req, res) {
	//:
	delete req.user.password;
	//.
	return res.json({ user: req.user });
}

module.exports = get;
