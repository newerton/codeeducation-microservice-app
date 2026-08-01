!(function (e) {
	function r(r) {
		for (
			var n, f, l = r[0], i = r[1], a = r[2], c = 0, s = [];
			c < l.length;
			c++
		)
			(f = l[c]), Object.hasOwn(o, f) && o[f] && s.push(o[f][0]), (o[f] = 0);
		for (n in i) Object.hasOwn(i, n) && (e[n] = i[n]);
		for (p?.(r); s.length; ) s.shift()();
		return u.push.apply(u, a || []), t();
	}
	function t() {
		for (var e, r = 0; r < u.length; r++) {
			for (var t = u[r], n = !0, l = 1; l < t.length; l++) {
				var i = t[l];
				0 !== o[i] && (n = !1);
			}
			n && (u.splice(r--, 1), (e = f((f.s = t[0]))));
		}
		return e;
	}
	var n = {},
		o = { 1: 0 },
		u = [];
	function f(r) {
		if (n[r]) return n[r].exports;
		var t = (n[r] = { i: r, l: !1, exports: {} });
		return e[r].call(t.exports, t, t.exports, f), (t.l = !0), t.exports;
	}
	(f.m = e),
		(f.c = n),
		(f.d = (e, r, t) => {
			f.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: t });
		}),
		(f.r = (e) => {
			"undefined" !== typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(e, "__esModule", { value: !0 });
		}),
		(f.t = (e, r) => {
			if ((1 & r && (e = f(e)), 8 & r)) return e;
			if (4 & r && "object" === typeof e && e?.__esModule) return e;
			var t = Object.create(null);
			if (
				(f.r(t),
				Object.defineProperty(t, "default", { enumerable: !0, value: e }),
				2 & r && "string" !== typeof e)
			)
				for (var n in e) f.d(t, n, ((r) => e[r]).bind(null, n));
			return t;
		}),
		(f.n = (e) => {
			var r = e?.__esModule ? () => e.default : () => e;
			return f.d(r, "a", r), r;
		}),
		(f.o = (e, r) => Object.hasOwn(e, r)),
		(f.p = "/admin-frontend/");
	var l = (this.webpackJsonpfrontend = this.webpackJsonpfrontend || []),
		i = l.push.bind(l);
	(l.push = r), (l = l.slice());
	for (var a = 0; a < l.length; a++) r(l[a]);
	var p = i;
	t();
})([]);
//# sourceMappingURL=runtime-main.3575b980.js.map
