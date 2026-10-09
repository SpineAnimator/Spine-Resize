(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../mods/node_modules/jszip/dist/jszip.min.js
  var require_jszip_min = __commonJS({
    "../../mods/node_modules/jszip/dist/jszip.min.js"(exports, module) {
      !(function(e) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
        else if ("function" == typeof define && define.amd) define([], e);
        else {
          ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
        }
      })(function() {
        return (function s(a, o, h) {
          function u(r, e2) {
            if (!o[r]) {
              if (!a[r]) {
                var t = "function" == typeof __require && __require;
                if (!e2 && t) return t(r, true);
                if (l) return l(r, true);
                var n = new Error("Cannot find module '" + r + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r] = { exports: {} };
              a[r][0].call(i.exports, function(e3) {
                var t2 = a[r][1][e3];
                return u(t2 || e3);
              }, i, i.exports, s, a, o, h);
            }
            return o[r].exports;
          }
          for (var l = "function" == typeof __require && __require, e = 0; e < h.length; e++) u(h[e]);
          return u;
        })({ 1: [function(e, t, r) {
          "use strict";
          var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          r.encode = function(e2) {
            for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
            return h.join("");
          }, r.decode = function(e2) {
            var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
            if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
            var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
            if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
            for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
            return l;
          };
        }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
          "use strict";
          var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
          function o(e2, t2, r2, n2, i2) {
            this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
          }
          o.prototype = { getContentWorker: function() {
            var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
            return e2.on("end", function() {
              if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
            }), e2;
          }, getCompressedWorker: function() {
            return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
          } }, o.createWorkerFrom = function(e2, t2, r2) {
            return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
          }, t.exports = o;
        }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
          "use strict";
          var n = e("./stream/GenericWorker");
          r.STORE = { magic: "\0\0", compressWorker: function() {
            return new n("STORE compression");
          }, uncompressWorker: function() {
            return new n("STORE decompression");
          } }, r.DEFLATE = e("./flate");
        }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
          "use strict";
          var n = e("./utils");
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2) {
            return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : 0;
          };
        }, { "./utils": 32 }], 5: [function(e, t, r) {
          "use strict";
          r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
        }, {}], 6: [function(e, t, r) {
          "use strict";
          var n = null;
          n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
        }, { lie: 37 }], 7: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
          function h(e2, t2) {
            a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
          }
          r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
            this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
          }, h.prototype.flush = function() {
            a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
          }, h.prototype.cleanUp = function() {
            a.prototype.cleanUp.call(this), this._pako = null;
          }, h.prototype._createPako = function() {
            this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
            var t2 = this;
            this._pako.onData = function(e2) {
              t2.push({ data: e2, meta: t2.meta });
            };
          }, r.compressWorker = function(e2) {
            return new h("Deflate", e2);
          }, r.uncompressWorker = function() {
            return new h("Inflate", {});
          };
        }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
          "use strict";
          function A(e2, t2) {
            var r2, n2 = "";
            for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
            return n2;
          }
          function n(e2, t2, r2, n2, i2, s2) {
            var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
            t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
            var S = 0;
            t2 && (S |= 8), l || !_ && !g || (S |= 2048);
            var z = 0, C = 0;
            w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= (function(e3, t3) {
              var r3 = e3;
              return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
            })(h.unixPermissions, w)) : (C = 20, z |= (function(e3) {
              return 63 & (e3 || 0);
            })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
            var E = "";
            return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
          }
          var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
          function s(e2, t2, r2, n2) {
            i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
          }
          I.inherits(s, i), s.prototype.push = function(e2) {
            var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
            this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
          }, s.prototype.openedSource = function(e2) {
            this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
            var t2 = this.streamFiles && !e2.file.dir;
            if (t2) {
              var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              this.push({ data: r2.fileRecord, meta: { percent: 0 } });
            } else this.accumulate = true;
          }, s.prototype.closedSource = function(e2) {
            this.accumulate = false;
            var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: (function(e3) {
              return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
            })(e2), meta: { percent: 100 } });
            else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
            this.currentFile = null;
          }, s.prototype.flush = function() {
            for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
            var r2 = this.bytesWritten - e2, n2 = (function(e3, t3, r3, n3, i2) {
              var s2 = I.transformTo("string", i2(n3));
              return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
            })(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
            this.push({ data: n2, meta: { percent: 100 } });
          }, s.prototype.prepareNextSource = function() {
            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
          }, s.prototype.registerPrevious = function(e2) {
            this._sources.push(e2);
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
          }, s.prototype.error = function(e2) {
            var t2 = this._sources;
            if (!i.prototype.error.call(this, e2)) return false;
            for (var r2 = 0; r2 < t2.length; r2++) try {
              t2[r2].error(e2);
            } catch (e3) {
            }
            return true;
          }, s.prototype.lock = function() {
            i.prototype.lock.call(this);
            for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
          }, t.exports = s;
        }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
          "use strict";
          var u = e("../compressions"), n = e("./ZipFileWorker");
          r.generateWorker = function(e2, a, t2) {
            var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
            try {
              e2.forEach(function(e3, t3) {
                h++;
                var r2 = (function(e4, t4) {
                  var r3 = e4 || t4, n3 = u[r3];
                  if (!n3) throw new Error(r3 + " is not a valid compression method !");
                  return n3;
                })(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
                t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
              }), o.entriesCount = h;
            } catch (e3) {
              o.error(e3);
            }
            return o;
          };
        }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
          "use strict";
          function n() {
            if (!(this instanceof n)) return new n();
            if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
            this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
              var e2 = new n();
              for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
              return e2;
            };
          }
          (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.2", n.loadAsync = function(e2, t2) {
            return new n().loadAsync(e2, t2);
          }, n.external = e("./external"), t.exports = n;
        }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
          "use strict";
          var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
          function f(n2) {
            return new i.Promise(function(e2, t2) {
              var r2 = n2.decompressed.getContentWorker().pipe(new a());
              r2.on("error", function(e3) {
                t2(e3);
              }).on("end", function() {
                r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
              }).resume();
            });
          }
          t.exports = function(e2, o) {
            var h = this;
            return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
              var t2 = new s(o);
              return t2.load(e3), t2;
            }).then(function(e3) {
              var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
              if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
              return i.Promise.all(t2);
            }).then(function(e3) {
              for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
                var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
                h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
              }
              return t2.zipComment.length && (h.comment = t2.zipComment), h;
            });
          };
        }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../stream/GenericWorker");
          function s(e2, t2) {
            i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
          }
          n.inherits(s, i), s.prototype._bindStream = function(e2) {
            var t2 = this;
            (this._stream = e2).pause(), e2.on("data", function(e3) {
              t2.push({ data: e3, meta: { percent: 0 } });
            }).on("error", function(e3) {
              t2.isPaused ? this.generatedError = e3 : t2.error(e3);
            }).on("end", function() {
              t2.isPaused ? t2._upstreamEnded = true : t2.end();
            });
          }, s.prototype.pause = function() {
            return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
          }, t.exports = s;
        }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
          "use strict";
          var i = e("readable-stream").Readable;
          function n(e2, t2, r2) {
            i.call(this, t2), this._helper = e2;
            var n2 = this;
            e2.on("data", function(e3, t3) {
              n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
            }).on("error", function(e3) {
              n2.emit("error", e3);
            }).on("end", function() {
              n2.push(null);
            });
          }
          e("../utils").inherits(n, i), n.prototype._read = function() {
            this._helper.resume();
          }, t.exports = n;
        }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
          "use strict";
          t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
            if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
            if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
            return new Buffer(e2, t2);
          }, allocBuffer: function(e2) {
            if (Buffer.alloc) return Buffer.alloc(e2);
            var t2 = new Buffer(e2);
            return t2.fill(0), t2;
          }, isBuffer: function(e2) {
            return Buffer.isBuffer(e2);
          }, isStream: function(e2) {
            return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
          } };
        }, {}], 15: [function(e, t, r) {
          "use strict";
          function s(e2, t2, r2) {
            var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
            s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
            var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
            r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
            var o2 = null;
            o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
            var h2 = new d(e2, o2, s2);
            this.files[e2] = h2;
          }
          var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
            "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
            var t2 = e2.lastIndexOf("/");
            return 0 < t2 ? e2.substring(0, t2) : "";
          }, g = function(e2) {
            return "/" !== e2.slice(-1) && (e2 += "/"), e2;
          }, b = function(e2, t2) {
            return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
          };
          function h(e2) {
            return "[object RegExp]" === Object.prototype.toString.call(e2);
          }
          var n = { load: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, forEach: function(e2) {
            var t2, r2, n2;
            for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
          }, filter: function(r2) {
            var n2 = [];
            return this.forEach(function(e2, t2) {
              r2(e2, t2) && n2.push(t2);
            }), n2;
          }, file: function(e2, t2, r2) {
            if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
            if (h(e2)) {
              var n2 = e2;
              return this.filter(function(e3, t3) {
                return !t3.dir && n2.test(e3);
              });
            }
            var i2 = this.files[this.root + e2];
            return i2 && !i2.dir ? i2 : null;
          }, folder: function(r2) {
            if (!r2) return this;
            if (h(r2)) return this.filter(function(e3, t3) {
              return t3.dir && r2.test(e3);
            });
            var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
            return n2.root = t2.name, n2;
          }, remove: function(r2) {
            r2 = this.root + r2;
            var e2 = this.files[r2];
            if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
            else for (var t2 = this.filter(function(e3, t3) {
              return t3.name.slice(0, r2.length) === r2;
            }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
            return this;
          }, generate: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, generateInternalStream: function(e2) {
            var t2, r2 = {};
            try {
              if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
              u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
              var n2 = r2.comment || this.comment || "";
              t2 = o.generateWorker(this, r2, n2);
            } catch (e3) {
              (t2 = new l("error")).error(e3);
            }
            return new a(t2, r2.type || "string", r2.mimeType);
          }, generateAsync: function(e2, t2) {
            return this.generateInternalStream(e2).accumulate(t2);
          }, generateNodeStream: function(e2, t2) {
            return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
          } };
          t.exports = n;
        }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
          "use strict";
          t.exports = e("stream");
        }, { stream: void 0 }], 17: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
            for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data[this.zero + e2];
          }, i.prototype.lastIndexOfSignature = function(e2) {
            for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
            return -1;
          }, i.prototype.readAndCheckSignature = function(e2) {
            var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
            return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
          }, i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return [];
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
          "use strict";
          var n = e("../utils");
          function i(e2) {
            this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
          }
          i.prototype = { checkOffset: function(e2) {
            this.checkIndex(this.index + e2);
          }, checkIndex: function(e2) {
            if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
          }, setIndex: function(e2) {
            this.checkIndex(e2), this.index = e2;
          }, skip: function(e2) {
            this.setIndex(this.index + e2);
          }, byteAt: function() {
          }, readInt: function(e2) {
            var t2, r2 = 0;
            for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
            return this.index += e2, r2;
          }, readString: function(e2) {
            return n.transformTo("string", this.readData(e2));
          }, readData: function() {
          }, lastIndexOfSignature: function() {
          }, readAndCheckSignature: function() {
          }, readDate: function() {
            var e2 = this.readInt(4);
            return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
          } }, t.exports = i;
        }, { "../utils": 32 }], 19: [function(e, t, r) {
          "use strict";
          var n = e("./Uint8ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data.charCodeAt(this.zero + e2);
          }, i.prototype.lastIndexOfSignature = function(e2) {
            return this.data.lastIndexOf(e2) - this.zero;
          }, i.prototype.readAndCheckSignature = function(e2) {
            return e2 === this.readData(4);
          }, i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
          "use strict";
          var n = e("./ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
            var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
          t.exports = function(e2) {
            var t2 = n.getTypeOf(e2);
            return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
          };
        }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
          "use strict";
          r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
        }, {}], 24: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../utils");
          function s(e2) {
            n.call(this, "ConvertWorker to " + e2), this.destType = e2;
          }
          i.inherits(s, n), s.prototype.processChunk = function(e2) {
            this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../crc32");
          function s() {
            n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
          }
          e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
            this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
          }, t.exports = s;
        }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
          }
          n.inherits(s, i), s.prototype.processChunk = function(e2) {
            if (e2) {
              var t2 = this.streamInfo[this.propName] || 0;
              this.streamInfo[this.propName] = t2 + e2.data.length;
            }
            i.prototype.processChunk.call(this, e2);
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataWorker");
            var t2 = this;
            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
              t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
            }, function(e3) {
              t2.error(e3);
            });
          }
          n.inherits(s, i), s.prototype.cleanUp = function() {
            i.prototype.cleanUp.call(this), this.data = null;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
          }, s.prototype._tickAndRepeat = function() {
            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
          }, s.prototype._tick = function() {
            if (this.isPaused || this.isFinished) return false;
            var e2 = null, t2 = Math.min(this.max, this.index + 16384);
            if (this.index >= this.max) return this.end();
            switch (this.type) {
              case "string":
                e2 = this.data.substring(this.index, t2);
                break;
              case "uint8array":
                e2 = this.data.subarray(this.index, t2);
                break;
              case "array":
              case "nodebuffer":
                e2 = this.data.slice(this.index, t2);
            }
            return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
          "use strict";
          function n(e2) {
            this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
          }
          n.prototype = { push: function(e2) {
            this.emit("data", e2);
          }, end: function() {
            if (this.isFinished) return false;
            this.flush();
            try {
              this.emit("end"), this.cleanUp(), this.isFinished = true;
            } catch (e2) {
              this.emit("error", e2);
            }
            return true;
          }, error: function(e2) {
            return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
          }, on: function(e2, t2) {
            return this._listeners[e2].push(t2), this;
          }, cleanUp: function() {
            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
          }, emit: function(e2, t2) {
            if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
          }, pipe: function(e2) {
            return e2.registerPrevious(this);
          }, registerPrevious: function(e2) {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, pause: function() {
            return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
          }, resume: function() {
            if (!this.isPaused || this.isFinished) return false;
            var e2 = this.isPaused = false;
            return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
          }, flush: function() {
          }, processChunk: function(e2) {
            this.push(e2);
          }, withStreamInfo: function(e2, t2) {
            return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
          }, mergeStreamInfo: function() {
            for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
          }, lock: function() {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.isLocked = true, this.previous && this.previous.lock();
          }, toString: function() {
            var e2 = "Worker " + this.name;
            return this.previous ? this.previous + " -> " + e2 : e2;
          } }, t.exports = n;
        }, {}], 29: [function(e, t, r) {
          "use strict";
          var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
          if (n.nodestream) try {
            o = e("../nodejs/NodejsStreamOutputAdapter");
          } catch (e2) {
          }
          function l(e2, o2) {
            return new a.Promise(function(t2, r2) {
              var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
              e2.on("data", function(e3, t3) {
                n2.push(e3), o2 && o2(t3);
              }).on("error", function(e3) {
                n2 = [], r2(e3);
              }).on("end", function() {
                try {
                  var e3 = (function(e4, t3, r3) {
                    switch (e4) {
                      case "blob":
                        return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                      case "base64":
                        return u.encode(t3);
                      default:
                        return h.transformTo(e4, t3);
                    }
                  })(s2, (function(e4, t3) {
                    var r3, n3 = 0, i3 = null, s3 = 0;
                    for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                    switch (e4) {
                      case "string":
                        return t3.join("");
                      case "array":
                        return Array.prototype.concat.apply([], t3);
                      case "uint8array":
                        for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                        return i3;
                      case "nodebuffer":
                        return Buffer.concat(t3);
                      default:
                        throw new Error("concat : unsupported type '" + e4 + "'");
                    }
                  })(i2, n2), a2);
                  t2(e3);
                } catch (e4) {
                  r2(e4);
                }
                n2 = [];
              }).resume();
            });
          }
          function f(e2, t2, r2) {
            var n2 = t2;
            switch (t2) {
              case "blob":
              case "arraybuffer":
                n2 = "uint8array";
                break;
              case "base64":
                n2 = "string";
            }
            try {
              this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
            } catch (e3) {
              this._worker = new s("error"), this._worker.error(e3);
            }
          }
          f.prototype = { accumulate: function(e2) {
            return l(this, e2);
          }, on: function(e2, t2) {
            var r2 = this;
            return "data" === e2 ? this._worker.on(e2, function(e3) {
              t2.call(r2, e3.data, e3.meta);
            }) : this._worker.on(e2, function() {
              h.delay(t2, arguments, r2);
            }), this;
          }, resume: function() {
            return h.delay(this._worker.resume, [], this._worker), this;
          }, pause: function() {
            return this._worker.pause(), this;
          }, toNodejsStream: function(e2) {
            if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
            return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
          } }, t.exports = f;
        }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
          "use strict";
          if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
          else {
            var n = new ArrayBuffer(0);
            try {
              r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
            } catch (e2) {
              try {
                var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
              } catch (e3) {
                r.blob = false;
              }
            }
          }
          try {
            r.nodestream = !!e("readable-stream").Readable;
          } catch (e2) {
            r.nodestream = false;
          }
        }, { "readable-stream": 16 }], 31: [function(e, t, s) {
          "use strict";
          for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
          u[254] = u[254] = 1;
          function a() {
            n.call(this, "utf-8 decode"), this.leftOver = null;
          }
          function l() {
            n.call(this, "utf-8 encode");
          }
          s.utf8encode = function(e2) {
            return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
              for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
              for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
              return t2;
            })(e2);
          }, s.utf8decode = function(e2) {
            return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
              for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
              else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
              else {
                for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
                1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
              }
              return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
            })(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
          }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
            var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
            if (this.leftOver && this.leftOver.length) {
              if (h.uint8array) {
                var r2 = t2;
                (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
              } else t2 = this.leftOver.concat(t2);
              this.leftOver = null;
            }
            var n2 = (function(e3, t3) {
              var r3;
              for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
              return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
            })(t2), i2 = t2;
            n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
          }, a.prototype.flush = function() {
            this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
          }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
            this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
          }, s.Utf8EncodeWorker = l;
        }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
          "use strict";
          var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
          function n(e2) {
            return e2;
          }
          function l(e2, t2) {
            for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
            return t2;
          }
          e("setimmediate"), a.newBlob = function(t2, r2) {
            a.checkSupport("blob");
            try {
              return new Blob([t2], { type: r2 });
            } catch (e2) {
              try {
                var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                return n2.append(t2), n2.getBlob(r2);
              } catch (e3) {
                throw new Error("Bug : can't construct the Blob.");
              }
            }
          };
          var i = { stringifyByChunk: function(e2, t2, r2) {
            var n2 = [], i2 = 0, s2 = e2.length;
            if (s2 <= r2) return String.fromCharCode.apply(null, e2);
            for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
            return n2.join("");
          }, stringifyByChar: function(e2) {
            for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
            return t2;
          }, applyCanBeUsed: { uint8array: (function() {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (e2) {
              return false;
            }
          })(), nodebuffer: (function() {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
            } catch (e2) {
              return false;
            }
          })() } };
          function s(e2) {
            var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
            if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
              return i.stringifyByChunk(e2, r2, t2);
            } catch (e3) {
              t2 = Math.floor(t2 / 2);
            }
            return i.stringifyByChar(e2);
          }
          function f(e2, t2) {
            for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
            return t2;
          }
          a.applyFromCharCode = s;
          var c = {};
          c.string = { string: n, array: function(e2) {
            return l(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.string.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return l(e2, new Uint8Array(e2.length));
          }, nodebuffer: function(e2) {
            return l(e2, r.allocBuffer(e2.length));
          } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
            return new Uint8Array(e2).buffer;
          }, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.arraybuffer = { string: function(e2) {
            return s(new Uint8Array(e2));
          }, array: function(e2) {
            return f(new Uint8Array(e2), new Array(e2.byteLength));
          }, arraybuffer: n, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(new Uint8Array(e2));
          } }, c.uint8array = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return e2.buffer;
          }, uint8array: n, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.nodebuffer = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.nodebuffer.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return f(e2, new Uint8Array(e2.length));
          }, nodebuffer: n }, a.transformTo = function(e2, t2) {
            if (t2 = t2 || "", !e2) return t2;
            a.checkSupport(e2);
            var r2 = a.getTypeOf(t2);
            return c[r2][e2](t2);
          }, a.resolve = function(e2) {
            for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
              var i2 = t2[n2];
              "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
            }
            return r2.join("/");
          }, a.getTypeOf = function(e2) {
            if ("string" == typeof e2) return "string";
            var t2 = Object.prototype.toString.call(e2);
            return "[object Array]" === t2 ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && "[object Uint8Array]" === t2 ? "uint8array" : o.arraybuffer && "[object ArrayBuffer]" === t2 ? "arraybuffer" : void 0;
          }, a.checkSupport = function(e2) {
            if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
          }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
            var t2, r2, n2 = "";
            for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
            return n2;
          }, a.delay = function(e2, t2, r2) {
            setImmediate(function() {
              e2.apply(r2 || null, t2 || []);
            });
          }, a.inherits = function(e2, t2) {
            function r2() {
            }
            r2.prototype = t2.prototype, e2.prototype = new r2();
          }, a.extend = function() {
            var e2, t2, r2 = {};
            for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
            return r2;
          }, a.prepareContent = function(r2, e2, n2, i2, s2) {
            return u.Promise.resolve(e2).then(function(n3) {
              return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) ? void 0 !== Blob.prototype.arrayBuffer ? n3.arrayBuffer() : "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
                var e3 = new FileReader();
                e3.onload = function(e4) {
                  t2(e4.target.result);
                }, e3.onerror = function(e4) {
                  r3(e4.target.error);
                }, e3.readAsArrayBuffer(n3);
              }) : u.Promise.reject(new Error(r2 + " is a Blob, but we have no way of reading it.")) : n3;
            }).then(function(e3) {
              var t2 = a.getTypeOf(e3);
              return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = (function(e4) {
                return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
              })(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
            });
          };
        }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
          function h(e2) {
            this.files = [], this.loadOptions = e2;
          }
          h.prototype = { checkSignature: function(e2) {
            if (!this.reader.readAndCheckSignature(e2)) {
              this.reader.index -= 4;
              var t2 = this.reader.readString(4);
              throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
            }
          }, isSignature: function(e2, t2) {
            var r2 = this.reader.index;
            this.reader.setIndex(e2);
            var n2 = this.reader.readString(4) === t2;
            return this.reader.setIndex(r2), n2;
          }, readBlockEndOfCentral: function() {
            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
            var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
            this.zipComment = this.loadOptions.decodeFileName(r2);
          }, readBlockZip64EndOfCentral: function() {
            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
            for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
          }, readBlockZip64EndOfCentralLocator: function() {
            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
          }, readLocalFiles: function() {
            var e2, t2;
            for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
          }, readCentralDir: function() {
            var e2;
            for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
            if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          }, readEndOfCentral: function() {
            var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
            if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
            this.reader.setIndex(e2);
            var t2 = e2;
            if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
              if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
              if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
            }
            var r2 = this.centralDirOffset + this.centralDirSize;
            this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
            var n2 = t2 - r2;
            if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
            else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
          }, prepareReader: function(e2) {
            this.reader = n(e2);
          }, load: function(e2) {
            this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
          } }, t.exports = h;
        }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
          function l(e2, t2) {
            this.options = e2, this.loadOptions = t2;
          }
          l.prototype = { isEncrypted: function() {
            return 1 == (1 & this.bitFlag);
          }, useUTF8: function() {
            return 2048 == (2048 & this.bitFlag);
          }, readLocalPart: function(e2) {
            var t2, r2;
            if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
            if (null === (t2 = (function(e3) {
              for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
              return null;
            })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
            this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
          }, readCentralPart: function(e2) {
            this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
            var t2 = e2.readInt(2);
            if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
            e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
          }, processAttributes: function() {
            this.unixPermissions = null, this.dosPermissions = null;
            var e2 = this.versionMadeBy >> 8;
            this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
          }, parseZIP64ExtraField: function() {
            if (this.extraFields[1]) {
              var e2 = n(this.extraFields[1].value);
              this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
            }
          }, readExtraFields: function(e2) {
            var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
            for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
            e2.setIndex(i2);
          }, handleUTF8: function() {
            var e2 = u.uint8array ? "uint8array" : "array";
            if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
            else {
              var t2 = this.findExtraFieldUnicodePath();
              if (null !== t2) this.fileNameStr = t2;
              else {
                var r2 = s.transformTo(e2, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(r2);
              }
              var n2 = this.findExtraFieldUnicodeComment();
              if (null !== n2) this.fileCommentStr = n2;
              else {
                var i2 = s.transformTo(e2, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(i2);
              }
            }
          }, findExtraFieldUnicodePath: function() {
            var e2 = this.extraFields[28789];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          }, findExtraFieldUnicodeComment: function() {
            var e2 = this.extraFields[25461];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          } }, t.exports = l;
        }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
          "use strict";
          function n(e2, t2, r2) {
            this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
          }
          var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
          n.prototype = { internalStream: function(e2) {
            var t2 = null, r2 = "string";
            try {
              if (!e2) throw new Error("No output type specified.");
              var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
              "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
              var i2 = !this._dataBinary;
              i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
            } catch (e3) {
              (t2 = new h("error")).error(e3);
            }
            return new s(t2, r2, "");
          }, async: function(e2, t2) {
            return this.internalStream(e2).accumulate(t2);
          }, nodeStream: function(e2, t2) {
            return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
          }, _compressWorker: function(e2, t2) {
            if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
            var r2 = this._decompressWorker();
            return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
          }, _decompressWorker: function() {
            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
          } };
          for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
          t.exports = n;
        }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
          (function(t2) {
            "use strict";
            var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
            if (e2) {
              var i = 0, s = new e2(u), a = t2.document.createTextNode("");
              s.observe(a, { characterData: true }), r = function() {
                a.data = i = ++i % 2;
              };
            } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
              var e3 = t2.document.createElement("script");
              e3.onreadystatechange = function() {
                u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
              }, t2.document.documentElement.appendChild(e3);
            } : function() {
              setTimeout(u, 0);
            };
            else {
              var o = new t2.MessageChannel();
              o.port1.onmessage = u, r = function() {
                o.port2.postMessage(0);
              };
            }
            var h = [];
            function u() {
              var e3, t3;
              n = true;
              for (var r2 = h.length; r2; ) {
                for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
                r2 = h.length;
              }
              n = false;
            }
            l.exports = function(e3) {
              1 !== h.push(e3) || n || r();
            };
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}], 37: [function(e, t, r) {
          "use strict";
          var i = e("immediate");
          function u() {
          }
          var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
          function o(e2) {
            if ("function" != typeof e2) throw new TypeError("resolver must be a function");
            this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
          }
          function h(e2, t2, r2) {
            this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
          }
          function f(t2, r2, n2) {
            i(function() {
              var e2;
              try {
                e2 = r2(n2);
              } catch (e3) {
                return l.reject(t2, e3);
              }
              e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
            });
          }
          function c(e2) {
            var t2 = e2 && e2.then;
            if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
              t2.apply(e2, arguments);
            };
          }
          function d(t2, e2) {
            var r2 = false;
            function n2(e3) {
              r2 || (r2 = true, l.reject(t2, e3));
            }
            function i2(e3) {
              r2 || (r2 = true, l.resolve(t2, e3));
            }
            var s2 = p(function() {
              e2(i2, n2);
            });
            "error" === s2.status && n2(s2.value);
          }
          function p(e2, t2) {
            var r2 = {};
            try {
              r2.value = e2(t2), r2.status = "success";
            } catch (e3) {
              r2.status = "error", r2.value = e3;
            }
            return r2;
          }
          (t.exports = o).prototype.finally = function(t2) {
            if ("function" != typeof t2) return this;
            var r2 = this.constructor;
            return this.then(function(e2) {
              return r2.resolve(t2()).then(function() {
                return e2;
              });
            }, function(e2) {
              return r2.resolve(t2()).then(function() {
                throw e2;
              });
            });
          }, o.prototype.catch = function(e2) {
            return this.then(null, e2);
          }, o.prototype.then = function(e2, t2) {
            if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
            var r2 = new this.constructor(u);
            this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
            return r2;
          }, h.prototype.callFulfilled = function(e2) {
            l.resolve(this.promise, e2);
          }, h.prototype.otherCallFulfilled = function(e2) {
            f(this.promise, this.onFulfilled, e2);
          }, h.prototype.callRejected = function(e2) {
            l.reject(this.promise, e2);
          }, h.prototype.otherCallRejected = function(e2) {
            f(this.promise, this.onRejected, e2);
          }, l.resolve = function(e2, t2) {
            var r2 = p(c, t2);
            if ("error" === r2.status) return l.reject(e2, r2.value);
            var n2 = r2.value;
            if (n2) d(e2, n2);
            else {
              e2.state = a, e2.outcome = t2;
              for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
            }
            return e2;
          }, l.reject = function(e2, t2) {
            e2.state = s, e2.outcome = t2;
            for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
            return e2;
          }, o.resolve = function(e2) {
            if (e2 instanceof this) return e2;
            return l.resolve(new this(u), e2);
          }, o.reject = function(e2) {
            var t2 = new this(u);
            return l.reject(t2, e2);
          }, o.all = function(e2) {
            var r2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var n2 = e2.length, i2 = false;
            if (!n2) return this.resolve([]);
            var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
            for (; ++t2 < n2; ) h2(e2[t2], t2);
            return o2;
            function h2(e3, t3) {
              r2.resolve(e3).then(function(e4) {
                s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
              }, function(e4) {
                i2 || (i2 = true, l.reject(o2, e4));
              });
            }
          }, o.race = function(e2) {
            var t2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var r2 = e2.length, n2 = false;
            if (!r2) return this.resolve([]);
            var i2 = -1, s2 = new this(u);
            for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
              n2 || (n2 = true, l.resolve(s2, e3));
            }, function(e3) {
              n2 || (n2 = true, l.reject(s2, e3));
            });
            var a2;
            return s2;
          };
        }, { immediate: 36 }], 38: [function(e, t, r) {
          "use strict";
          var n = {};
          (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
        }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
          "use strict";
          var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
          function p(e2) {
            if (!(this instanceof p)) return new p(e2);
            this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
            var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
            if (r2 !== l) throw new Error(i[r2]);
            if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
              var n2;
              if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
              this._dict_set = true;
            }
          }
          function n(e2, t2) {
            var r2 = new p(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
            return r2.result;
          }
          p.prototype.push = function(e2, t2) {
            var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
            do {
              if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
              0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
            } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
            return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
          }, p.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, p.prototype.onEnd = function(e2) {
            e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, n(e2, t2);
          }, r.gzip = function(e2, t2) {
            return (t2 = t2 || {}).gzip = true, n(e2, t2);
          };
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
          "use strict";
          var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
          function a(e2) {
            if (!(this instanceof a)) return new a(e2);
            this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
            var r2 = c.inflateInit2(this.strm, t2.windowBits);
            if (r2 !== m.Z_OK) throw new Error(n[r2]);
            this.header = new s(), c.inflateGetHeader(this.strm, this.header);
          }
          function o(e2, t2) {
            var r2 = new a(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
            return r2.result;
          }
          a.prototype.push = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
            do {
              if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
              h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
            } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
            return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
          }, a.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, a.prototype.onEnd = function(e2) {
            e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, o(e2, t2);
          }, r.ungzip = o;
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
          r.assign = function(e2) {
            for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
              var r2 = t2.shift();
              if (r2) {
                if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
                for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
              }
            }
            return e2;
          }, r.shrinkBuf = function(e2, t2) {
            return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
          };
          var i = { arraySet: function(e2, t2, r2, n2, i2) {
            if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
            else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            var t2, r2, n2, i2, s2, a;
            for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
            for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
            return a;
          } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
            for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            return [].concat.apply([], e2);
          } };
          r.setTyped = function(e2) {
            e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
          }, r.setTyped(n);
        }, {}], 42: [function(e, t, r) {
          "use strict";
          var h = e("./common"), i = true, s = true;
          try {
            String.fromCharCode.apply(null, [0]);
          } catch (e2) {
            i = false;
          }
          try {
            String.fromCharCode.apply(null, new Uint8Array(1));
          } catch (e2) {
            s = false;
          }
          for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
          function l(e2, t2) {
            if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
            for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
            return r2;
          }
          u[254] = u[254] = 1, r.string2buf = function(e2) {
            var t2, r2, n2, i2, s2, a = e2.length, o = 0;
            for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          }, r.buf2binstring = function(e2) {
            return l(e2, e2.length);
          }, r.binstring2buf = function(e2) {
            for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
            return t2;
          }, r.buf2string = function(e2, t2) {
            var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
            for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
            else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
            else {
              for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
              1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
            }
            return l(o, n2);
          }, r.utf8border = function(e2, t2) {
            var r2;
            for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
            return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
          };
        }, { "./common": 41 }], 43: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2, r2, n) {
            for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
              for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
              i %= 65521, s %= 65521;
            }
            return i | s << 16 | 0;
          };
        }, {}], 44: [function(e, t, r) {
          "use strict";
          t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 45: [function(e, t, r) {
          "use strict";
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2, r2, n) {
            var i = o, s = n + r2;
            e2 ^= -1;
            for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
            return -1 ^ e2;
          };
        }, {}], 46: [function(e, t, r) {
          "use strict";
          var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
          function R(e2, t2) {
            return e2.msg = n[t2], t2;
          }
          function T(e2) {
            return (e2 << 1) - (4 < e2 ? 9 : 0);
          }
          function D(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          function F2(e2) {
            var t2 = e2.state, r2 = t2.pending;
            r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
          }
          function N(e2, t2) {
            u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F2(e2.strm);
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = t2;
          }
          function P(e2, t2) {
            e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
          }
          function L(e2, t2) {
            var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
            do {
              if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
                s2 += 2, r2++;
                do {
                } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
                if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                  if (e2.match_start = t2, o2 <= (a2 = n2)) break;
                  d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
                }
              }
            } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
            return a2 <= e2.lookahead ? a2 : e2.lookahead;
          }
          function j(e2) {
            var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
            do {
              if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
                for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                i2 += f2;
              }
              if (0 === e2.strm.avail_in) break;
              if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
            } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
          }
          function Z(e2, t2) {
            for (var r2, n2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
                for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
                e2.strstart++;
              } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
              else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
              if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function W(e2, t2) {
            for (var r2, n2, i2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
                for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
                if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
              } else if (e2.match_available) {
                if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
              } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
            }
            return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function M(e2, t2, r2, n2, i2) {
            this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
          }
          function H() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
          }
          function G(e2) {
            var t2;
            return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
          }
          function K(e2) {
            var t2 = G(e2);
            return t2 === m && (function(e3) {
              e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
            })(e2.state), t2;
          }
          function Y(e2, t2, r2, n2, i2, s2) {
            if (!e2) return _;
            var a2 = 1;
            if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
            8 === n2 && (n2 = 9);
            var o2 = new H();
            return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
          }
          h = [new M(0, 0, 0, 0, function(e2, t2) {
            var r2 = 65535;
            for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
              if (e2.lookahead <= 1) {
                if (j(e2), 0 === e2.lookahead && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              e2.strstart += e2.lookahead, e2.lookahead = 0;
              var n2 = e2.block_start + r2;
              if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
              if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
          }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
            return Y(e2, t2, v, 15, 8, 0);
          }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
            return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
          }, r.deflate = function(e2, t2) {
            var r2, n2, i2, s2;
            if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
            if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
            if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
            else {
              var a2 = v + (n2.w_bits - 8 << 4) << 8;
              a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
            }
            if (69 === n2.status) if (n2.gzhead.extra) {
              for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
            } else n2.status = 73;
            if (73 === n2.status) if (n2.gzhead.name) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
            } else n2.status = 91;
            if (91 === n2.status) if (n2.gzhead.comment) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F2(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
            } else n2.status = 103;
            if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F2(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
              if (F2(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
            } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
            if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
            if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
              var o2 = 2 === n2.strategy ? (function(e3, t3) {
                for (var r3; ; ) {
                  if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                    if (t3 === l) return A;
                    break;
                  }
                  if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : 3 === n2.strategy ? (function(e3, t3) {
                for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                  if (e3.lookahead <= S) {
                    if (j(e3), e3.lookahead <= S && t3 === l) return A;
                    if (0 === e3.lookahead) break;
                  }
                  if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                    s3 = e3.strstart + S;
                    do {
                    } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                    e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                  }
                  if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : h[n2.level].func(n2, t2);
              if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
              if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F2(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
            }
            return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F2(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
          }, r.deflateEnd = function(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
          }, r.deflateSetDictionary = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
            if (!e2 || !e2.state) return _;
            if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
            for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
              for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
              r2.strstart = n2, r2.lookahead = x - 1, j(r2);
            }
            return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
          }, r.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
          };
        }, {}], 48: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2) {
            var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
            r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
            e: do {
              p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
              t: for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
                else {
                  if (!(16 & y)) {
                    if (0 == (64 & y)) {
                      v = m[(65535 & v) + (d & (1 << y) - 1)];
                      continue t;
                    }
                    if (32 & y) {
                      r2.mode = 12;
                      break e;
                    }
                    e2.msg = "invalid literal/length code", r2.mode = 30;
                    break e;
                  }
                  w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                  r: for (; ; ) {
                    if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                      if (0 == (64 & y)) {
                        v = _[(65535 & v) + (d & (1 << y) - 1)];
                        continue r;
                      }
                      e2.msg = "invalid distance code", r2.mode = 30;
                      break e;
                    }
                    if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break e;
                    }
                    if (d >>>= y, p -= y, (y = s - a) < k) {
                      if (l < (y = k - y) && r2.sane) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break e;
                      }
                      if (S = c, (x = 0) === f) {
                        if (x += u - y, y < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          x = s - k, S = C;
                        }
                      } else if (f < y) {
                        if (x += u + f - y, (y -= f) < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          if (x = 0, f < w) {
                            for (w -= y = f; C[s++] = c[x++], --y; ) ;
                            x = s - k, S = C;
                          }
                        }
                      } else if (x += f - y, y < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                      for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                      w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                    } else {
                      for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                      w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                    }
                    break;
                  }
                }
                break;
              }
            } while (n < i && s < o);
            n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
          };
        }, {}], 49: [function(e, t, r) {
          "use strict";
          var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F2 = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
          function L(e2) {
            return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
          }
          function s() {
            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
          }
          function a(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
          }
          function o(e2) {
            var t2;
            return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
          }
          function h(e2, t2) {
            var r2, n2;
            return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
          }
          function u(e2, t2) {
            var r2, n2;
            return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
          }
          var l, f, c = true;
          function j(e2) {
            if (c) {
              var t2;
              for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
              for (; t2 < 256; ) e2.lens[t2++] = 9;
              for (; t2 < 280; ) e2.lens[t2++] = 7;
              for (; t2 < 288; ) e2.lens[t2++] = 8;
              for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
              T(F2, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
            }
            e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
          }
          function Z(e2, t2, r2, n2) {
            var i2, s2 = e2.state;
            return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
          }
          r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
            return u(e2, 15);
          }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
            12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
            e: for (; ; ) switch (r2.mode) {
              case P:
                if (0 === r2.wrap) {
                  r2.mode = 13;
                  break;
                }
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (2 & r2.wrap && 35615 === u2) {
                  E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                  break;
                }
                if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                  e2.msg = "incorrect header check", r2.mode = 30;
                  break;
                }
                if (8 != (15 & u2)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
                else if (k > r2.wbits) {
                  e2.msg = "invalid window size", r2.mode = 30;
                  break;
                }
                r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                break;
              case 2:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.flags = u2, 8 != (255 & r2.flags)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (57344 & r2.flags) {
                  e2.msg = "unknown header flags set", r2.mode = 30;
                  break;
                }
                r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
              case 3:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
              case 4:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
              case 5:
                if (1024 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                } else r2.head && (r2.head.extra = null);
                r2.mode = 6;
              case 6:
                if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
                r2.length = 0, r2.mode = 7;
              case 7:
                if (2048 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.name = null);
                r2.length = 0, r2.mode = 8;
              case 8:
                if (4096 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.comment = null);
                r2.mode = 9;
              case 9:
                if (512 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (65535 & r2.check)) {
                    e2.msg = "header crc mismatch", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                break;
              case 10:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
              case 11:
                if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                e2.adler = r2.check = 1, r2.mode = 12;
              case 12:
                if (5 === t2 || 6 === t2) break e;
              case 13:
                if (r2.last) {
                  u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                  break;
                }
                for (; l2 < 3; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                  case 0:
                    r2.mode = 14;
                    break;
                  case 1:
                    if (j(r2), r2.mode = 20, 6 !== t2) break;
                    u2 >>>= 2, l2 -= 2;
                    break e;
                  case 2:
                    r2.mode = 17;
                    break;
                  case 3:
                    e2.msg = "invalid block type", r2.mode = 30;
                }
                u2 >>>= 2, l2 -= 2;
                break;
              case 14:
                for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                  e2.msg = "invalid stored block lengths", r2.mode = 30;
                  break;
                }
                if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
              case 15:
                r2.mode = 16;
              case 16:
                if (d = r2.length) {
                  if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
                  I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                  break;
                }
                r2.mode = 12;
                break;
              case 17:
                for (; l2 < 14; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                  e2.msg = "too many length or distance symbols", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 18;
              case 18:
                for (; r2.have < r2.ncode; ) {
                  for (; l2 < 3; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                }
                for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                  else {
                    if (16 === b) {
                      for (z = _ + 2; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                        e2.msg = "invalid bit length repeat", r2.mode = 30;
                        break;
                      }
                      k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                    } else if (17 === b) {
                      for (z = _ + 3; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                    } else {
                      for (z = _ + 7; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                    }
                    if (r2.have + d > r2.nlen + r2.ndist) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    for (; d--; ) r2.lens[r2.have++] = k;
                  }
                }
                if (30 === r2.mode) break;
                if (0 === r2.lens[256]) {
                  e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                  break;
                }
                if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F2, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2) break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h2) {
                  e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                  r2.mode = 26;
                  break;
                }
                if (32 & g) {
                  r2.back = -1, r2.mode = 12;
                  break;
                }
                if (64 & g) {
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break;
                }
                r2.extra = 15 & g, r2.mode = 22;
              case 22:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                r2.was = r2.length, r2.mode = 23;
              case 23:
                for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break;
                }
                r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
              case 24:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                if (r2.offset > r2.dmax) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                r2.mode = 25;
              case 25:
                if (0 === h2) break e;
                if (d = c2 - h2, r2.offset > d) {
                  if ((d = r2.offset - d) > r2.whave && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break;
                  }
                  p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                } else m = i2, p = a2 - r2.offset, d = r2.length;
                for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
                0 === r2.length && (r2.mode = 21);
                break;
              case 26:
                if (0 === h2) break e;
                i2[a2++] = r2.length, h2--, r2.mode = 21;
                break;
              case 27:
                if (r2.wrap) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 |= n2[s2++] << l2, l2 += 8;
                  }
                  if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                    e2.msg = "incorrect data check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 28;
              case 28:
                if (r2.wrap && r2.flags) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (4294967295 & r2.total)) {
                    e2.msg = "incorrect length check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 29;
              case 29:
                x = 1;
                break e;
              case 30:
                x = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return U;
            }
            return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
          }, r.inflateEnd = function(e2) {
            if (!e2 || !e2.state) return U;
            var t2 = e2.state;
            return t2.window && (t2.window = null), e2.state = null, N;
          }, r.inflateGetHeader = function(e2, t2) {
            var r2;
            return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
          }, r.inflateSetDictionary = function(e2, t2) {
            var r2, n2 = t2.length;
            return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
          }, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
          "use strict";
          var D = e("../utils/common"), F2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
          t.exports = function(e2, t2, r2, n, i, s, a, o) {
            var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
            for (b = 0; b <= 15; b++) O[b] = 0;
            for (v = 0; v < n; v++) O[t2[r2 + v]]++;
            for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
            if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
            for (y = 1; y < w && 0 === O[y]; y++) ;
            for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
            if (0 < z && (0 === e2 || 1 !== w)) return -1;
            for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
            for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
            if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F2, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
            for (; ; ) {
              for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
              for (h = 1 << b - 1; E & h; ) h >>= 1;
              if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
                if (b === w) break;
                b = t2[r2 + a[v]];
              }
              if (k < b && (E & f) !== l) {
                for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
                if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
                i[l = E & f] = k << 24 | x << 16 | c - s | 0;
              }
            }
            return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
          };
        }, { "../utils/common": 41 }], 51: [function(e, t, r) {
          "use strict";
          t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 52: [function(e, t, r) {
          "use strict";
          var i = e("../utils/common"), o = 0, h = 1;
          function n(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
          n(z);
          var C = new Array(2 * f);
          n(C);
          var E = new Array(512);
          n(E);
          var A = new Array(256);
          n(A);
          var I = new Array(a);
          n(I);
          var O, B, R, T = new Array(f);
          function D(e2, t2, r2, n2, i2) {
            this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
          }
          function F2(e2, t2) {
            this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
          }
          function N(e2) {
            return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
          }
          function P(e2, t2, r2) {
            e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
          }
          function L(e2, t2, r2) {
            P(e2, r2[2 * t2], r2[2 * t2 + 1]);
          }
          function j(e2, t2) {
            for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
            return r2 >>> 1;
          }
          function Z(e2, t2, r2) {
            var n2, i2, s2 = new Array(g + 1), a2 = 0;
            for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
            for (i2 = 0; i2 <= t2; i2++) {
              var o2 = e2[2 * i2 + 1];
              0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
            }
          }
          function W(e2) {
            var t2;
            for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
            for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
            for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
            e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
          }
          function M(e2) {
            8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
          }
          function H(e2, t2, r2, n2) {
            var i2 = 2 * t2, s2 = 2 * r2;
            return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
          }
          function G(e2, t2, r2) {
            for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
            e2.heap[r2] = n2;
          }
          function K(e2, t2, r2) {
            var n2, i2, s2, a2, o2 = 0;
            if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
            L(e2, m, t2);
          }
          function Y(e2, t2) {
            var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
            for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
            for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
            for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G(e2, s2, r2);
            for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; ) ;
            e2.heap[--e2.heap_max] = e2.heap[1], (function(e3, t3) {
              var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
              for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
              for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
              if (0 !== m2) {
                do {
                  for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
                  e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                } while (0 < m2);
                for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
              }
            })(e2, t2), Z(s2, u2, e2.bl_count);
          }
          function X(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
          }
          function V(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
              if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
              else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
              s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
            }
          }
          n(T);
          var q = false;
          function J(e2, t2, r2, n2) {
            P(e2, (s << 1) + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
            })(e2, t2, r2, true);
          }
          r._tr_init = function(e2) {
            q || ((function() {
              var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
              for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
              for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
              for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
              for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
              for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
              for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
              for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
              O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
            })(), q = true), e2.l_desc = new F2(e2.dyn_ltree, O), e2.d_desc = new F2(e2.dyn_dtree, B), e2.bl_desc = new F2(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
          }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
            var i2, s2, a2 = 0;
            0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = (function(e3) {
              var t3, r3 = 4093624447;
              for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
              if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
              for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
              return o;
            })(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = (function(e3) {
              var t3;
              for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
              return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
            })(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              var i3;
              for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
              V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
            })(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
          }, r._tr_tally = function(e2, t2, r2) {
            return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
          }, r._tr_align = function(e2) {
            P(e2, 2, 3), L(e2, m, z), (function(e3) {
              16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
            })(e2);
          };
        }, { "../utils/common": 41 }], 53: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
          };
        }, {}], 54: [function(e, t, r) {
          (function(e2) {
            !(function(r2, n) {
              "use strict";
              if (!r2.setImmediate) {
                var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
                e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
                  process.nextTick(function() {
                    c(e4);
                  });
                } : (function() {
                  if (r2.postMessage && !r2.importScripts) {
                    var e4 = true, t3 = r2.onmessage;
                    return r2.onmessage = function() {
                      e4 = false;
                    }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                  }
                })() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                  r2.postMessage(a + e4, "*");
                }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                  c(e4.data);
                }, function(e4) {
                  t2.port2.postMessage(e4);
                }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                  var t3 = l.createElement("script");
                  t3.onreadystatechange = function() {
                    c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                  }, s.appendChild(t3);
                }) : function(e4) {
                  setTimeout(c, 0, e4);
                }, e3.setImmediate = function(e4) {
                  "function" != typeof e4 && (e4 = new Function("" + e4));
                  for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
                  var n2 = { callback: e4, args: t3 };
                  return h[o] = n2, i(o), o++;
                }, e3.clearImmediate = f;
              }
              function f(e4) {
                delete h[e4];
              }
              function c(e4) {
                if (u) setTimeout(c, 0, e4);
                else {
                  var t3 = h[e4];
                  if (t3) {
                    u = true;
                    try {
                      !(function(e5) {
                        var t4 = e5.callback, r3 = e5.args;
                        switch (r3.length) {
                          case 0:
                            t4();
                            break;
                          case 1:
                            t4(r3[0]);
                            break;
                          case 2:
                            t4(r3[0], r3[1]);
                            break;
                          case 3:
                            t4(r3[0], r3[1], r3[2]);
                            break;
                          default:
                            t4.apply(n, r3);
                        }
                      })(t3);
                    } finally {
                      f(e4), u = false;
                    }
                  }
                }
              }
              function d(e4) {
                e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
              }
            })("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}] }, {}, [10])(10);
      });
    }
  });

  // src/lib/spine/resizeProject.ts
  var import_jszip = __toESM(require_jszip_min());

  // src/lib/spine/spineSkel.ts
  function skelFlag(name) {
    const env = globalThis.process?.env;
    return !!env?.[name];
  }
  var skelDebugOnce = true;
  var ATT_REGION = 0;
  var ATT_BBOX = 1;
  var ATT_MESH = 2;
  var ATT_LINKED = 3;
  var ATT_PATH = 4;
  var ATT_POINT = 5;
  var ATT_CLIP = 6;
  var BONE_INHERIT = 10;
  var BONE_TRANSLATE = 1;
  var BONE_TRANSLATEX = 2;
  var BONE_TRANSLATEY = 3;
  var SLOT_ATTACHMENT = 0;
  var SLOT_RGBA = 1;
  var SLOT_RGB = 2;
  var SLOT_RGBA2 = 3;
  var SLOT_RGB2 = 4;
  var SLOT_ALPHA = 5;
  var C_IK = 0;
  var C_PATH = 1;
  var C_TRANSFORM = 2;
  var C_PHYSICS = 3;
  var C_SLIDER = 4;
  var ATT_DEFORM = 0;
  var ATT_SEQUENCE = 1;
  var PATH_MIX = 2;
  var PHYSICS_RESET = 8;
  var CURVE_BEZIER = 2;
  var In = class {
    o = 0;
    strings = [];
    view;
    bytes;
    constructor(bytes) {
      this.bytes = bytes;
      this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    }
    rb() {
      return this.view.getInt8(this.o++);
    }
    ub() {
      return this.view.getUint8(this.o++);
    }
    i32() {
      const v = this.view.getInt32(this.o);
      this.o += 4;
      return v;
    }
    fbits() {
      const b = this.view.getInt32(this.o);
      this.o += 4;
      return b;
    }
    vi(opt = true) {
      let b = this.rb();
      let result = b & 127;
      if ((b & 128) !== 0) {
        b = this.rb();
        result |= (b & 127) << 7;
        if ((b & 128) !== 0) {
          b = this.rb();
          result |= (b & 127) << 14;
          if ((b & 128) !== 0) {
            b = this.rb();
            result |= (b & 127) << 21;
            if ((b & 128) !== 0) {
              b = this.rb();
              result |= (b & 127) << 28;
            }
          }
        }
      }
      return opt ? result >>> 0 : result >>> 1 ^ -(result & 1);
    }
    str() {
      let n = this.vi();
      if (n === 0) return null;
      if (n === 1) return "";
      n--;
      let chars = "";
      const end = this.o + n;
      while (this.o < end) {
        const b = this.ub();
        switch (b >> 4) {
          case 12:
          case 13:
            chars += String.fromCharCode((b & 31) << 6 | this.rb() & 63);
            break;
          case 14:
            chars += String.fromCharCode((b & 15) << 12 | (this.rb() & 63) << 6 | this.rb() & 63);
            break;
          default:
            chars += String.fromCharCode(b);
        }
      }
      return chars;
    }
    sref() {
      return this.vi();
    }
    slice(from) {
      return this.bytes.subarray(from, this.o);
    }
  };
  function F(bits, k = 0) {
    return { bits, k };
  }
  var Out = class {
    a = [];
    u8(v) {
      this.a.push(v & 255);
    }
    i8(v) {
      this.u8(v);
    }
    i32(v) {
      this.u8(v >>> 24);
      this.u8(v >>> 16);
      this.u8(v >>> 8);
      this.u8(v);
    }
    vi(value, opt = true) {
      let v = value | 0;
      if (!opt) v = v << 1 ^ v >> 31;
      let u = v >>> 0;
      while (u >>> 7) {
        this.u8(u & 127 | 128);
        u >>>= 7;
      }
      this.u8(u);
    }
    str(s) {
      if (s == null) {
        this.vi(0);
        return;
      }
      if (s === "") {
        this.vi(1);
        return;
      }
      const enc = new TextEncoder().encode(s);
      this.vi(enc.length + 1);
      for (const b of enc) this.u8(b);
    }
    flt(f, factor) {
      if (f.k === 0 || factor === 1) {
        this.i32(f.bits);
        return;
      }
      const view = new DataView(new ArrayBuffer(4));
      view.setInt32(0, f.bits);
      const n = view.getFloat32(0) * factor;
      view.setFloat32(0, n);
      this.i32(view.getInt32(0));
    }
    bytes() {
      return new Uint8Array(this.a);
    }
  };
  function readSeq(r, has) {
    if (!has) return null;
    return { count: r.vi(), start: r.vi(), digits: r.vi(), setupIndex: r.vi() };
  }
  function writeSeq(w, s) {
    if (!s) return;
    w.vi(s.count);
    w.vi(s.start);
    w.vi(s.digits);
    w.vi(s.setupIndex);
  }
  function readVerts(r, weighted) {
    const vertexCount = r.vi();
    const length = vertexCount << 1;
    if (!weighted) {
      const verts2 = [];
      for (let i = 0; i < length; i++) verts2.push(F(r.fbits(), 1));
      return { vertexCount, bones: null, verts: verts2 };
    }
    const n = r.vi();
    const bones = [];
    const verts = [];
    for (let b = 0; b < n; ) {
      const boneCount = r.vi();
      bones.push(boneCount);
      b++;
      for (let ii = 0; ii < boneCount; ii++) {
        bones.push(r.vi());
        b++;
        verts.push(F(r.fbits(), 1));
        verts.push(F(r.fbits(), 1));
        verts.push(F(r.fbits(), 0));
      }
    }
    return { vertexCount, bones, verts };
  }
  function readAttachment(r, nonessential, _placeholder) {
    const flags = r.ub();
    const name = (flags & 8) !== 0 ? r.sref() : null;
    const kind = flags & 7;
    if (kind === ATT_REGION) {
      const path = (flags & 16) !== 0 ? r.sref() : null;
      const color = (flags & 32) !== 0 ? r.i32() : null;
      const sequence = readSeq(r, (flags & 64) !== 0);
      const rotation = (flags & 128) !== 0 ? F(r.fbits()) : F(floatBits(0));
      const hasRot = (flags & 128) !== 0;
      return {
        type: "region",
        flags,
        name,
        path,
        color,
        sequence,
        rotation: hasRot ? rotation : F(floatBits(0)),
        x: F(r.fbits(), 1),
        y: F(r.fbits(), 1),
        scaleX: F(r.fbits()),
        scaleY: F(r.fbits()),
        width: F(r.fbits(), 1),
        height: F(r.fbits(), 1)
      };
    }
    if (kind === ATT_BBOX) {
      const weighted = (flags & 16) !== 0;
      const vv = readVerts(r, weighted);
      const color = nonessential ? r.i32() : null;
      return { type: "bbox", flags, name, weighted, vertexCount: vv.vertexCount, bones: vv.bones, verts: vv.verts, color };
    }
    if (kind === ATT_MESH) {
      const path = (flags & 16) !== 0 ? r.sref() : null;
      const color = (flags & 32) !== 0 ? r.i32() : null;
      const sequence = readSeq(r, (flags & 64) !== 0);
      const hull = r.vi();
      const weighted = (flags & 128) !== 0;
      const vv = readVerts(r, weighted);
      const uvs = [];
      for (let i = 0; i < vv.vertexCount * 2; i++) uvs.push(F(r.fbits()));
      const triN = (vv.vertexCount * 2 - hull - 2) * 3;
      const triangles = [];
      for (let i = 0; i < triN; i++) triangles.push(r.vi());
      const slotCount = r.vi();
      const timelineSlots = [];
      for (let i = 0; i < slotCount; i++) timelineSlots.push(r.vi());
      let edges = null;
      let width = null;
      let height = null;
      if (nonessential) {
        const en = r.vi();
        edges = [];
        for (let i = 0; i < en; i++) edges.push(r.vi());
        width = F(r.fbits(), 1);
        height = F(r.fbits(), 1);
      }
      return {
        type: "mesh",
        flags,
        name,
        path,
        color,
        sequence,
        hull,
        weighted,
        vertexCount: vv.vertexCount,
        bones: vv.bones,
        verts: vv.verts,
        uvs,
        triangles,
        timelineSlots: slotCount ? timelineSlots : [],
        edges,
        width,
        height
      };
    }
    if (kind === ATT_LINKED) {
      const path = (flags & 16) !== 0 ? r.sref() : null;
      const color = (flags & 32) !== 0 ? r.i32() : null;
      const sequence = readSeq(r, (flags & 64) !== 0);
      const inherit = (flags & 128) !== 0;
      const sourceIndex = r.vi();
      const skinIndex = r.vi();
      const source = r.sref();
      let width = null;
      let height = null;
      if (nonessential) {
        width = F(r.fbits(), 1);
        height = F(r.fbits(), 1);
      }
      return { type: "linked", flags, name, path, color, sequence, inherit, sourceIndex, skinIndex, source, width, height };
    }
    if (kind === ATT_PATH) {
      const weighted = (flags & 64) !== 0;
      const vv = readVerts(r, weighted);
      const lengths = [];
      const ln = Math.floor(vv.vertexCount / 3);
      for (let i = 0; i < ln; i++) lengths.push(F(r.fbits(), 1));
      const color = nonessential ? r.i32() : null;
      return { type: "path", flags, name, weighted, vertexCount: vv.vertexCount, bones: vv.bones, verts: vv.verts, lengths, color };
    }
    if (kind === ATT_POINT) {
      return {
        type: "point",
        flags,
        name,
        rotation: F(r.fbits()),
        x: F(r.fbits(), 1),
        y: F(r.fbits(), 1),
        color: nonessential ? r.i32() : null
      };
    }
    if (kind === ATT_CLIP) {
      const endSlot = r.vi();
      const weighted = (flags & 16) !== 0;
      const vv = readVerts(r, weighted);
      const color = nonessential ? r.i32() : null;
      return { type: "clip", flags, name, endSlot, weighted, vertexCount: vv.vertexCount, bones: vv.bones, verts: vv.verts, color };
    }
    throw new Error("Unknown attachment type " + kind);
  }
  function writeAttachment(w, a, factor, nonessential) {
    if (a.type === "region") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      if (a.flags & 16) w.strRef(a.path);
      if (a.flags & 32) w.i32(a.color ?? -1);
      writeSeq(w, a.flags & 64 ? a.sequence : null);
      if (a.flags & 128) w.flt(a.rotation, factor);
      w.flt(a.x, factor);
      w.flt(a.y, factor);
      w.flt(a.scaleX, factor);
      w.flt(a.scaleY, factor);
      w.flt(a.width, factor);
      w.flt(a.height, factor);
      return;
    }
    if (a.type === "bbox") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
      if (nonessential) w.i32(a.color ?? 0);
      return;
    }
    if (a.type === "mesh") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      if (a.flags & 16) w.strRef(a.path);
      if (a.flags & 32) w.i32(a.color ?? -1);
      writeSeq(w, a.flags & 64 ? a.sequence : null);
      w.vi(a.hull);
      writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
      for (const u of a.uvs) w.flt(u, factor);
      for (const t of a.triangles) w.vi(t);
      w.vi(a.timelineSlots ? a.timelineSlots.length : 0);
      for (const s of a.timelineSlots ?? []) w.vi(s);
      if (nonessential && a.edges && a.width && a.height) {
        w.vi(a.edges.length);
        for (const e of a.edges) w.vi(e);
        w.flt(a.width, factor);
        w.flt(a.height, factor);
      }
      return;
    }
    if (a.type === "linked") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      if (a.flags & 16) w.strRef(a.path);
      if (a.flags & 32) w.i32(a.color ?? -1);
      writeSeq(w, a.flags & 64 ? a.sequence : null);
      w.vi(a.sourceIndex);
      w.vi(a.skinIndex);
      w.strRef(a.source);
      if (nonessential && a.width && a.height) {
        w.flt(a.width, factor);
        w.flt(a.height, factor);
      }
      return;
    }
    if (a.type === "path") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
      for (const l of a.lengths) w.flt(l, factor);
      if (nonessential) w.i32(a.color ?? 0);
      return;
    }
    if (a.type === "point") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      w.flt(a.rotation, factor);
      w.flt(a.x, factor);
      w.flt(a.y, factor);
      if (nonessential) w.i32(a.color ?? 0);
      return;
    }
    if (a.type === "clip") {
      w.u8(a.flags);
      if (a.flags & 8) w.strRef(a.name);
      w.vi(a.endSlot);
      writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
      if (nonessential) w.i32(a.color ?? 0);
    }
  }
  function writeVertsKnown(w, vertexCount, bones, verts, factor) {
    w.vi(vertexCount);
    if (!bones) {
      for (const f of verts) w.flt(f, factor);
      return;
    }
    w.vi(bones.length);
    let bi = 0;
    let vi = 0;
    while (bi < bones.length) {
      const bc = bones[bi++];
      w.vi(bc);
      for (let i = 0; i < bc; i++) {
        w.vi(bones[bi++]);
        w.flt(verts[vi++], factor);
        w.flt(verts[vi++], factor);
        w.flt(verts[vi++], factor);
      }
    }
  }
  Out.prototype.strRef = function(s) {
    this.vi(s ?? 0);
  };
  function floatBits(n) {
    const v = new DataView(new ArrayBuffer(4));
    v.setFloat32(0, n);
    return v.getInt32(0);
  }
  function floatOf(f) {
    const v = new DataView(new ArrayBuffer(4));
    v.setInt32(0, f.bits);
    return v.getFloat32(0);
  }
  function setFloat(f, n) {
    const v = new DataView(new ArrayBuffer(4));
    v.setFloat32(0, n);
    f.bits = v.getInt32(0);
  }
  function mulFloat(f, m) {
    if (!f || m === 1) return;
    setFloat(f, floatOf(f) * m);
  }
  function readSkin(r, nonessential, isDefault) {
    if (isDefault) {
      const slotCount2 = r.vi();
      if (slotCount2 === 0) return null;
      const slots = [];
      for (let i = 0; i < slotCount2; i++) {
        const slotIndex = r.vi();
        const nn = r.vi();
        const atts = [];
        for (let ii = 0; ii < nn; ii++) {
          const placeholder = r.sref();
          const p0 = r.o;
          const att = readAttachment(r, nonessential, placeholder);
          att._raw = r.bytes.slice(p0, r.o);
          atts.push({ placeholder, att });
        }
        slots.push({ slotIndex, atts });
      }
      return { name: "default", defaultSkin: true, slots };
    }
    const name = r.str();
    if (!name) throw new Error("Skin name null");
    const skin = { name, defaultSkin: false, slots: [] };
    if (nonessential) skin.color = r.i32();
    const bn = r.vi();
    skin.bones = [];
    for (let i = 0; i < bn; i++) skin.bones.push(r.vi());
    const cn = r.vi();
    skin.constraints = [];
    for (let i = 0; i < cn; i++) skin.constraints.push(r.vi());
    const slotCount = r.vi();
    for (let i = 0; i < slotCount; i++) {
      const slotIndex = r.vi();
      const nn = r.vi();
      const atts = [];
      for (let ii = 0; ii < nn; ii++) {
        const placeholder = r.sref();
        atts.push({ placeholder, att: readAttachment(r, nonessential, placeholder) });
      }
      skin.slots.push({ slotIndex, atts });
    }
    return skin;
  }
  function writeSkin(w, skin, factor, nonessential) {
    if (skin.defaultSkin) {
      w.vi(skin.slots.length);
    } else {
      w.str(skin.name);
      if (nonessential) w.i32(skin.color ?? -1);
      w.vi(skin.bones?.length ?? 0);
      for (const b of skin.bones ?? []) w.vi(b);
      w.vi(skin.constraints?.length ?? 0);
      for (const c of skin.constraints ?? []) w.vi(c);
      w.vi(skin.slots.length);
    }
    for (const sl of skin.slots) {
      w.vi(sl.slotIndex);
      w.vi(sl.atts.length);
      for (const a of sl.atts) {
        if (skelFlag("SKEL_POS")) console.log("ph", w.a.length, a.placeholder, a.att.type);
        w.strRef(a.placeholder);
        const before = w.a.length;
        writeAttachment(w, a.att, factor, nonessential);
        const raw = a.att._raw;
        if (raw && factor === 1 && skelDebugOnce && skelFlag("SKEL_DEBUG")) {
          const got = w.a.slice(before);
          if (got.length !== raw.length || got.some((b, i) => b !== raw[i])) {
            console.log("ATT MISMATCH", a.att.type, "ph", a.placeholder, "got", got.length, "raw", raw.length, "flags", a.att.flags);
            console.log("raw", [...raw.slice(0, 24)]);
            console.log("got", got.slice(0, 24));
            skelDebugOnce = false;
          }
        }
      }
    }
  }
  function readCurves1(r, frameCount, valueScale) {
    const frames = [];
    let time = F(r.fbits());
    let value = F(r.fbits(), valueScale);
    for (let frame = 0; ; frame++) {
      if (frame === frameCount - 1) {
        frames.push({ time, values: [value], curve: null, bez: [] });
        break;
      }
      const time2 = F(r.fbits());
      const value2 = F(r.fbits(), valueScale);
      const c = r.ub();
      const bez = [];
      if (c === CURVE_BEZIER) {
        bez.push(F(r.fbits()), F(r.fbits(), valueScale), F(r.fbits()), F(r.fbits(), valueScale));
      }
      frames.push({ time, values: [value], curve: c, bez });
      time = time2;
      value = value2;
    }
    return { bezierCount: 0, frames };
  }
  function readCurves2(r, frameCount, ks) {
    const frames = [];
    let time = F(r.fbits());
    let a = F(r.fbits(), ks);
    let b = F(r.fbits(), ks);
    for (let frame = 0; ; frame++) {
      if (frame === frameCount - 1) {
        frames.push({ time, values: [a, b], curve: null, bez: [] });
        break;
      }
      const time2 = F(r.fbits());
      const a2 = F(r.fbits(), ks);
      const b2 = F(r.fbits(), ks);
      const c = r.ub();
      const bez = [];
      if (c === CURVE_BEZIER) {
        bez.push(F(r.fbits()), F(r.fbits(), ks), F(r.fbits()), F(r.fbits(), ks));
        bez.push(F(r.fbits()), F(r.fbits(), ks), F(r.fbits()), F(r.fbits(), ks));
      }
      frames.push({ time, values: [a, b], curve: c, bez });
      time = time2;
      a = a2;
      b = b2;
    }
    return { bezierCount: 0, frames };
  }
  function writeCurves(w, c, factor) {
    const frames = c.frames;
    if (!frames.length) return;
    w.flt(frames[0].time, factor);
    for (const v of frames[0].values) w.flt(v, factor);
    for (let i = 0; i < frames.length - 1; i++) {
      const next = frames[i + 1];
      w.flt(next.time, factor);
      for (const v of next.values) w.flt(v, factor);
      const fr = frames[i];
      w.u8(fr.curve ?? 0);
      for (const b of fr.bez) w.flt(b, factor);
    }
  }
  function skipColorCurve(r, frameCount, channels) {
    const readCh = () => {
      for (let i = 0; i < channels; i++) r.ub();
    };
    r.fbits();
    readCh();
    for (let frame = 0; frame < frameCount - 1; frame++) {
      r.fbits();
      readCh();
      const c = r.ub();
      if (c === CURVE_BEZIER) {
        for (let k = 0; k < channels; k++) {
          r.fbits();
          r.fbits();
          r.fbits();
          r.fbits();
        }
      }
    }
  }
  function readSkel(bytes) {
    const r = new In(bytes);
    const hashLow = r.i32();
    const hashHigh = r.i32();
    const version = r.str();
    const x = F(r.fbits(), 1);
    const y = F(r.fbits(), 1);
    const width = F(r.fbits(), 1);
    const height = F(r.fbits(), 1);
    const referenceScale = F(r.fbits());
    const nonessential = r.ub() !== 0;
    const sk = {
      hashLow,
      hashHigh,
      version,
      x,
      y,
      width,
      height,
      referenceScale,
      nonessential,
      strings: [],
      bones: [],
      slots: [],
      constraints: [],
      skins: [],
      events: [],
      animations: [],
      sliderAnims: []
    };
    if (nonessential) {
      sk.fps = F(r.fbits());
      sk.images = r.str();
      sk.audio = r.str();
    }
    const ns = r.vi();
    for (let i = 0; i < ns; i++) {
      const s = r.str();
      if (s == null) throw new Error("String in string table must not be null.");
      r.strings.push(s);
      sk.strings.push(s);
    }
    const nb = r.vi();
    for (let i = 0; i < nb; i++) {
      const name = r.str();
      if (!name) throw new Error("Bone name null");
      const parent = i === 0 ? null : r.vi();
      const bone = {
        name,
        parent,
        rotation: F(r.fbits()),
        x: F(r.fbits(), 1),
        y: F(r.fbits(), 1),
        scaleX: F(r.fbits()),
        scaleY: F(r.fbits()),
        shearX: F(r.fbits()),
        shearY: F(r.fbits()),
        inherit: r.ub(),
        length: F(r.fbits(), 1),
        skinRequired: r.ub()
      };
      if (nonessential) {
        bone.color = r.i32();
        bone.icon = r.str();
        bone.iconSize = F(r.fbits());
        bone.iconRotation = F(r.fbits());
        bone.visible = r.ub();
      }
      sk.bones.push(bone);
    }
    if (skelFlag("SKEL_DEBUG")) console.log("after bones", r.o);
    const nslots = r.vi();
    for (let i = 0; i < nslots; i++) {
      const start = r.o;
      r.str();
      r.vi();
      r.i32();
      r.i32();
      r.sref();
      r.vi();
      if (nonessential) r.ub();
      sk.slots.push(r.bytes.slice(start, r.o));
    }
    if (skelFlag("SKEL_DEBUG")) console.log("after slots", r.o);
    const cc = r.vi();
    let sliderCount = 0;
    for (let i = 0; i < cc; i++) {
      const name = r.str();
      if (!name) throw new Error("constraint name");
      const kind = r.ub();
      if (kind === C_IK) {
        const bn = r.vi();
        const bones = [];
        for (let j = 0; j < bn; j++) bones.push(r.vi());
        const target = r.vi();
        const flags = r.ub();
        let scaleYMode;
        if (flags & 2) scaleYMode = r.ub();
        let mix;
        if (flags & 32) mix = flags & 64 ? F(r.fbits()) : F(floatBits(1));
        const mixWritten = (flags & 32) !== 0 && (flags & 64) !== 0;
        let softness;
        if (flags & 128) softness = F(r.fbits(), 1);
        sk.constraints.push({
          kind: "ik",
          name,
          bones,
          target,
          flags,
          scaleYMode,
          mix: mixWritten ? mix : flags & 32 ? F(floatBits(1)) : void 0,
          softness
        });
        sk.constraints[sk.constraints.length - 1].mixWritten = mixWritten;
      } else if (kind === C_SLIDER) {
        sliderCount++;
        const start = r.o;
        const flags = r.ub();
        if (flags & 8) r.fbits();
        if (flags & 16 && flags & 32) r.fbits();
        if (flags & 64) {
          r.vi();
          r.fbits();
          r.ub();
          r.fbits();
          r.fbits();
        }
        const raw = r.bytes.slice(start, r.o);
        sk.constraints.push({ kind: "slider", name, raw });
      } else {
        const start = r.o;
        if (kind === C_PATH) {
          const bn = r.vi();
          const bones = [];
          for (let j = 0; j < bn; j++) bones.push(r.vi());
          const slot = r.vi();
          const flags = r.ub();
          const positionMode = flags >> 1 & 1;
          const spacingMode = flags >> 2 & 3;
          let offsetRotation;
          if (flags & 128) offsetRotation = F(r.fbits());
          const position = F(r.fbits(), positionMode === 0 ? 1 : 0);
          const spacing = F(r.fbits(), spacingMode === 0 || spacingMode === 1 ? 1 : 0);
          const mixRotate = F(r.fbits());
          const mixX = F(r.fbits());
          const mixY = F(r.fbits());
          sk.constraints.push({
            kind: "path",
            name,
            bones,
            slot,
            flags,
            offsetRotation,
            position,
            spacing,
            mixRotate,
            mixX,
            mixY,
            positionScaled: positionMode === 0,
            spacingScaled: spacingMode === 0 || spacingMode === 1
          });
        } else if (kind === C_TRANSFORM || kind === C_PHYSICS) {
          if (kind === C_PHYSICS) parsePhysics(r);
          else parseTransform(r);
          sk.constraints.push({ kind: kind === C_PHYSICS ? "physics" : "transform", name, raw: r.bytes.slice(start, r.o) });
        } else {
          throw new Error("Unknown constraint " + kind + " at " + r.o);
        }
      }
    }
    if (skelFlag("SKEL_DEBUG")) console.log("after constraints", r.o, "sliders", sliderCount);
    const def = readSkin(r, nonessential, true);
    if (def) sk.skins.push(def);
    const extra = r.vi();
    for (let i = 0; i < extra; i++) {
      const s = readSkin(r, nonessential, false);
      if (s) sk.skins.push(s);
    }
    if (skelFlag("SKEL_DEBUG")) console.log("after skins", r.o);
    const ne = r.vi();
    for (let i = 0; i < ne; i++) {
      const start = r.o;
      r.str();
      r.vi(false);
      r.fbits();
      const audio = r.str();
      if (audio) {
        r.fbits();
        r.fbits();
      }
      sk.events.push(r.bytes.slice(start, r.o));
    }
    if (skelFlag("SKEL_DEBUG")) console.log("after events", r.o);
    const na = r.vi();
    for (let i = 0; i < na; i++) sk.animations.push(readAnimationFull(r, nonessential));
    if (skelFlag("SKEL_DEBUG")) console.log("anim", sk.animations.length, r.o);
    for (let i = 0; i < sliderCount; i++) sk.sliderAnims.push(r.vi());
    if (r.o !== bytes.length) {
      throw new Error(`skel parse stopped at ${r.o} of ${bytes.length}`);
    }
    return sk;
  }
  function parseTransform(r) {
    const nn = r.vi();
    for (let i = 0; i < nn; i++) r.vi();
    r.vi();
    let flags = r.ub();
    const propN = flags >> 5;
    for (let i = 0; i < propN; i++) {
      const from = r.ub();
      if (from > 5) continue;
      r.fbits();
      const tn = r.ub();
      for (let t = 0; t < tn; t++) {
        const to = r.ub();
        if (to > 5) continue;
        r.fbits();
        r.fbits();
        r.fbits();
      }
    }
    flags = r.ub();
    for (const bit of [1, 2, 4, 8, 16, 32]) if (flags & bit) r.fbits();
    flags = r.ub();
    for (const bit of [1, 2, 4, 8, 16, 32]) if (flags & bit) r.fbits();
  }
  function parsePhysics(r) {
    r.vi();
    let flags = r.ub();
    if (flags & 2) r.fbits();
    if (flags & 4) r.fbits();
    if (flags & 8) r.fbits();
    if (flags & 16) r.fbits();
    if (flags & 32) r.fbits();
    if (flags & 64) r.fbits();
    r.ub();
    r.fbits();
    r.fbits();
    r.fbits();
    if (flags & 128) r.fbits();
    r.fbits();
    r.fbits();
    flags = r.ub();
    if (flags & 128) r.fbits();
  }
  function readAnimationFull(r, nonessential) {
    const name = r.str();
    const timelineCount = r.vi();
    const anim = {
      name,
      timelineCount,
      slots: [],
      bones: [],
      ik: [],
      transform: [],
      path: [],
      physics: [],
      slider: [],
      attachments: [],
      drawOrder: null,
      folders: [],
      events: null,
      color: null
    };
    let n = r.vi();
    for (let i = 0; i < n; i++) {
      const slotIndex = r.vi();
      const nn = r.vi();
      const items = [];
      for (let ii = 0; ii < nn; ii++) {
        const start = r.o;
        const timelineType = r.ub();
        const frameCount = r.vi();
        if (timelineType === SLOT_ATTACHMENT) {
          for (let f = 0; f < frameCount; f++) {
            r.fbits();
            r.vi();
          }
        } else if (timelineType === SLOT_ALPHA) {
          r.vi();
          skipCurve1(r, frameCount);
        } else if (timelineType === SLOT_RGB) {
          r.vi();
          skipColorCurve(r, frameCount, 3);
        } else if (timelineType === SLOT_RGBA) {
          r.vi();
          skipColorCurve(r, frameCount, 4);
        } else if (timelineType === SLOT_RGB2) {
          r.vi();
          skipColorCurve(r, frameCount, 6);
        } else if (timelineType === SLOT_RGBA2) {
          r.vi();
          skipColorCurve(r, frameCount, 7);
        } else throw new Error("bad slot tl " + timelineType);
        items.push({ type: timelineType, raw: r.bytes.slice(start, r.o) });
      }
      anim.slots.push({ slotIndex, items });
    }
    if (skelFlag("SKEL_POS")) console.log("read anim bones", r.o, name);
    n = r.vi();
    for (let i = 0; i < n; i++) {
      const boneIndex = r.vi();
      const nn = r.vi();
      const items = [];
      for (let ii = 0; ii < nn; ii++) {
        const type = r.ub();
        const frameCount = r.vi();
        if (type === BONE_INHERIT) {
          const inheritFrames = [];
          for (let f = 0; f < frameCount; f++) inheritFrames.push({ time: F(r.fbits()), v: r.ub() });
          items.push({ type, frameCount, inheritFrames });
          continue;
        }
        const bezierCount = r.vi();
        const scaleK = type === BONE_TRANSLATE || type === BONE_TRANSLATEX || type === BONE_TRANSLATEY ? 1 : 0;
        const two = type === 1 || type === 4 || type === 7;
        const curves = two ? readCurves2(r, frameCount, scaleK) : readCurves1(r, frameCount, scaleK);
        curves.bezierCount = bezierCount;
        items.push({ type, frameCount, curves });
      }
      anim.bones.push({ boneIndex, items });
    }
    anim.ik.push(captureBlock(r, (rr) => {
      const n1 = rr.vi();
      for (let i = 0; i < n1; i++) {
        rr.vi();
        const frameCount = rr.vi();
        rr.vi();
        let flags = rr.ub();
        rr.fbits();
        if (flags & 1 && flags & 2) rr.fbits();
        if (flags & 4) rr.fbits();
        for (let f = 0; f < frameCount - 1; f++) {
          flags = rr.ub();
          rr.fbits();
          if (flags & 1 && flags & 2) rr.fbits();
          if (flags & 4) rr.fbits();
          if (flags & 128) {
            for (let k = 0; k < 8; k++) rr.fbits();
          }
        }
      }
    }));
    anim.transform.push(captureBlock(r, (rr) => {
      const n1 = rr.vi();
      for (let i = 0; i < n1; i++) {
        rr.vi();
        const frameCount = rr.vi();
        rr.vi();
        skipMix6(rr, frameCount);
      }
    }));
    anim.path.push(captureBlock(r, (rr) => {
      const n1 = rr.vi();
      for (let i = 0; i < n1; i++) {
        rr.vi();
        const nn = rr.vi();
        for (let ii = 0; ii < nn; ii++) {
          const type = rr.ub();
          const frameCount = rr.vi();
          rr.vi();
          if (type === PATH_MIX) skipMix3(rr, frameCount);
          else skipCurve1(rr, frameCount);
        }
      }
    }));
    anim.physics.push(captureBlock(r, (rr) => {
      const n1 = rr.vi();
      for (let i = 0; i < n1; i++) {
        rr.vi();
        const nn = rr.vi();
        for (let ii = 0; ii < nn; ii++) {
          const type = rr.ub();
          const frameCount = rr.vi();
          if (type === PHYSICS_RESET) {
            for (let f = 0; f < frameCount; f++) rr.fbits();
          } else {
            rr.vi();
            skipCurve1(rr, frameCount);
          }
        }
      }
    }));
    anim.slider.push(captureBlock(r, (rr) => {
      const n1 = rr.vi();
      for (let i = 0; i < n1; i++) {
        rr.vi();
        const nn = rr.vi();
        for (let ii = 0; ii < nn; ii++) {
          rr.ub();
          const frameCount = rr.vi();
          rr.vi();
          skipCurve1(rr, frameCount);
        }
      }
    }));
    anim.attachments.push(captureBlock(r, (rr) => {
      const n1 = rr.vi();
      for (let i = 0; i < n1; i++) {
        rr.vi();
        const nn = rr.vi();
        for (let ii = 0; ii < nn; ii++) {
          rr.vi();
          const nnn = rr.vi();
          for (let iii = 0; iii < nnn; iii++) {
            rr.vi();
            const timelineType = rr.ub();
            const frameCount = rr.vi();
            if (timelineType === ATT_DEFORM) {
              rr.vi();
              rr.fbits();
              for (let frame = 0; ; frame++) {
                const end = rr.vi();
                if (end !== 0) {
                  rr.vi();
                  for (let v = 0; v < end; v++) rr.fbits();
                }
                if (frame === frameCount - 1) break;
                rr.fbits();
                const c = rr.ub();
                if (c === CURVE_BEZIER) {
                  for (let k = 0; k < 4; k++) rr.fbits();
                }
              }
            } else if (timelineType === ATT_SEQUENCE) {
              for (let f = 0; f < frameCount; f++) {
                rr.fbits();
                rr.i32();
                rr.fbits();
              }
            } else throw new Error("att tl " + timelineType);
          }
        }
      }
    }));
    anim.drawOrder = captureBlock(r, (rr) => {
      const drawOrderCount = rr.vi();
      for (let i = 0; i < drawOrderCount; i++) {
        rr.fbits();
        const change = rr.vi();
        for (let c = 0; c < change; c++) {
          rr.vi();
          rr.vi();
        }
      }
    })[0];
    anim.folders = captureBlock(r, (rr) => {
      const folderCount = rr.vi();
      for (let i = 0; i < folderCount; i++) {
        const folderSlotCount = rr.vi();
        for (let ii = 0; ii < folderSlotCount; ii++) rr.vi();
        const keyCount = rr.vi();
        for (let ii = 0; ii < keyCount; ii++) {
          rr.fbits();
          const change = rr.vi();
          for (let c = 0; c < change; c++) {
            rr.vi();
            rr.vi();
          }
        }
      }
    });
    anim.events = captureBlock(r, (rr) => {
      const eventCount = rr.vi();
      for (let i = 0; i < eventCount; i++) {
        rr.fbits();
        rr.vi();
        rr.vi(false);
        rr.fbits();
        const s = rr.str();
        void s;
      }
    })[0];
    if (nonessential) anim.color = r.i32();
    return anim;
  }
  function skipCurve1(r, frameCount) {
    r.fbits();
    r.fbits();
    for (let frame = 0; frame < frameCount - 1; frame++) {
      r.fbits();
      r.fbits();
      const c = r.ub();
      if (c === CURVE_BEZIER) for (let k = 0; k < 4; k++) r.fbits();
    }
  }
  function skipMix6(r, frameCount) {
    for (let i = 0; i < 7; i++) r.fbits();
    for (let frame = 0; frame < frameCount - 1; frame++) {
      for (let i = 0; i < 7; i++) r.fbits();
      const c = r.ub();
      if (c === CURVE_BEZIER) for (let k = 0; k < 6 * 4; k++) r.fbits();
    }
  }
  function skipMix3(r, frameCount) {
    for (let i = 0; i < 4; i++) r.fbits();
    for (let frame = 0; frame < frameCount - 1; frame++) {
      for (let i = 0; i < 4; i++) r.fbits();
      const c = r.ub();
      if (c === CURVE_BEZIER) for (let k = 0; k < 12; k++) r.fbits();
    }
  }
  function captureBlock(r, fn) {
    const s = r.o;
    fn(r);
    return [r.bytes.slice(s, r.o)];
  }
  function writeSkel(sk, factor = 1) {
    const w = new Out();
    w.strings = sk.strings;
    w.i32(sk.hashLow);
    w.i32(sk.hashHigh);
    w.str(sk.version);
    w.flt(sk.x, factor);
    w.flt(sk.y, factor);
    w.flt(sk.width, factor);
    w.flt(sk.height, factor);
    w.flt(sk.referenceScale, factor);
    w.u8(sk.nonessential ? 1 : 0);
    if (sk.nonessential) {
      w.flt(sk.fps, factor);
      w.str(sk.images ?? null);
      w.str(sk.audio ?? null);
    }
    w.vi(sk.strings.length);
    for (const s of sk.strings) w.str(s);
    w.vi(sk.bones.length);
    for (let i = 0; i < sk.bones.length; i++) {
      const b = sk.bones[i];
      w.str(b.name);
      if (i !== 0) w.vi(b.parent ?? 0);
      w.flt(b.rotation, factor);
      w.flt(b.x, factor);
      w.flt(b.y, factor);
      w.flt(b.scaleX, factor);
      w.flt(b.scaleY, factor);
      w.flt(b.shearX, factor);
      w.flt(b.shearY, factor);
      w.u8(b.inherit);
      w.flt(b.length, factor);
      w.u8(b.skinRequired);
      if (sk.nonessential) {
        w.i32(b.color ?? -1);
        w.str(b.icon ?? null);
        w.flt(b.iconSize, factor);
        w.flt(b.iconRotation, factor);
        w.u8(b.visible ?? 1);
      }
    }
    w.vi(sk.slots.length);
    for (const raw of sk.slots) for (const b of raw) w.u8(b);
    w.vi(sk.constraints.length);
    for (const c of sk.constraints) {
      if (c.kind === "ik") {
        w.str(c.name);
        w.u8(C_IK);
        w.vi(c.bones.length);
        for (const b of c.bones) w.vi(b);
        w.vi(c.target);
        w.u8(c.flags);
        if (c.flags & 2) w.u8(c.scaleYMode ?? 0);
        const mixWritten = c.mixWritten;
        if (mixWritten && c.mix) w.flt(c.mix, factor);
        if (c.softness) w.flt(c.softness, factor);
      } else if (c.kind === "path") {
        w.str(c.name);
        w.u8(C_PATH);
        w.vi(c.bones.length);
        for (const b of c.bones) w.vi(b);
        w.vi(c.slot);
        w.u8(c.flags);
        if (c.offsetRotation) w.flt(c.offsetRotation, factor);
        w.flt(c.position, factor);
        w.flt(c.spacing, factor);
        w.flt(c.mixRotate, factor);
        w.flt(c.mixX, factor);
        w.flt(c.mixY, factor);
      } else if (c.kind === "transform" || c.kind === "physics" || c.kind === "slider") {
        w.str(c.name);
        w.u8(c.kind === "transform" ? C_TRANSFORM : c.kind === "physics" ? C_PHYSICS : C_SLIDER);
        for (const b of c.raw) w.u8(b);
      }
    }
    if (skelFlag("SKEL_DEBUG")) console.log("write before skins", w.a.length);
    const def = sk.skins.find((s) => s.defaultSkin);
    if (def) writeSkin(w, def, factor, sk.nonessential);
    else w.vi(0);
    const extras = sk.skins.filter((s) => !s.defaultSkin);
    w.vi(extras.length);
    for (const s of extras) writeSkin(w, s, factor, sk.nonessential);
    if (skelFlag("SKEL_DEBUG")) console.log("write after skins", w.a.length);
    w.vi(sk.events.length);
    for (const raw of sk.events) for (const b of raw) w.u8(b);
    w.vi(sk.animations.length);
    for (const a of sk.animations) writeAnim(w, a, factor, sk.nonessential);
    for (const s of sk.sliderAnims) w.vi(s);
    return w.bytes();
  }
  function writeAnim(w, a, factor, nonessential) {
    w.str(a.name);
    w.vi(a.timelineCount);
    if (skelFlag("SKEL_POS")) console.log("anim slots", w.a.length);
    w.vi(a.slots.length);
    for (const s of a.slots) {
      w.vi(s.slotIndex);
      w.vi(s.items.length);
      for (const it of s.items) for (const b of it.raw) w.u8(b);
    }
    if (skelFlag("SKEL_POS")) console.log("anim bones", w.a.length, a.name);
    w.vi(a.bones.length);
    for (const g of a.bones) {
      w.vi(g.boneIndex);
      w.vi(g.items.length);
      for (const it of g.items) {
        w.u8(it.type);
        w.vi(it.frameCount);
        if (it.inheritFrames) {
          for (const f of it.inheritFrames) {
            w.flt(f.time, factor);
            w.u8(f.v);
          }
        } else if (it.curves) {
          w.vi(it.curves.bezierCount);
          writeCurves(w, it.curves, factor);
        }
      }
    }
    const dump = (chunks) => {
      const walk = (c) => {
        if (c instanceof Uint8Array) for (const b of c) w.u8(b);
        else if (Array.isArray(c)) for (const x of c) walk(x);
      };
      for (const c of chunks) walk(c);
    };
    if (skelFlag("SKEL_POS")) console.log("anim rest", w.a.length);
    dump(a.ik);
    dump(a.transform);
    dump(a.path);
    dump(a.physics);
    dump(a.slider);
    dump(a.attachments);
    if (a.drawOrder instanceof Uint8Array) for (const b of a.drawOrder) w.u8(b);
    dump(a.folders);
    if (a.events instanceof Uint8Array) for (const b of a.events) w.u8(b);
    if (nonessential && a.color != null) w.i32(a.color);
  }
  function scaleSkel(sk, factor, offsetX = 0, offsetY = 0) {
    if (sk.bones[0]) {
    }
    const apply = (f) => {
      if (!f || f.k === 0) return;
      const v = new DataView(new ArrayBuffer(4));
      v.setInt32(0, f.bits);
      let n = v.getFloat32(0) * factor;
      v.setFloat32(0, n);
      f.bits = v.getInt32(0);
      f.k = 0;
    };
    const walk = (o) => {
      if (!o || typeof o !== "object") return;
      if (Array.isArray(o)) {
        for (const x of o) walk(x);
        return;
      }
      const rec = o;
      if (typeof rec.bits === "number" && (rec.k === 0 || rec.k === 1)) {
        apply(rec);
        return;
      }
      for (const k of Object.keys(rec)) walk(rec[k]);
    };
    walk(sk);
    if ((offsetX || offsetY) && sk.bones[0]) {
      const bx = new DataView(new ArrayBuffer(4));
      bx.setInt32(0, sk.bones[0].x.bits);
      bx.setFloat32(0, bx.getFloat32(0) + offsetX);
      sk.bones[0].x.bits = bx.getInt32(0);
      const by = new DataView(new ArrayBuffer(4));
      by.setInt32(0, sk.bones[0].y.bits);
      by.setFloat32(0, by.getFloat32(0) + offsetY);
      sk.bones[0].y.bits = by.getInt32(0);
    }
  }
  function slotBoneIndex(raw) {
    const r = new In(raw);
    r.str();
    return r.vi();
  }
  function scaleCurveValues(curves, sx, sy, mode) {
    if (!curves) return;
    const mx = mode === "div" ? sx === 0 ? 1 : 1 / sx : sx;
    const my = mode === "div" ? sy === 0 ? 1 : 1 / sy : sy;
    if (mx === 1 && my === 1) return;
    for (const fr of curves.frames) {
      if (fr.values[0]) mulFloat(fr.values[0], mx);
      if (fr.values[1]) mulFloat(fr.values[1], my);
      const dims = fr.values.length;
      for (let d = 0; d < dims; d++) {
        const m = d === 0 ? mx : my;
        const base = d * 4;
        if (fr.bez[base + 1]) mulFloat(fr.bez[base + 1], m);
        if (fr.bez[base + 3]) mulFloat(fr.bez[base + 3], m);
      }
    }
  }
  function scaleInfluences(bones, verts, bone, sx, sy) {
    let bi = 0;
    let vi = 0;
    while (bi < bones.length) {
      const bc = bones[bi++];
      for (let k = 0; k < bc; k++) {
        const b = bones[bi++];
        if (b === bone) {
          mulFloat(verts[vi], sx);
          mulFloat(verts[vi + 1], sy);
        }
        vi += 3;
      }
    }
  }
  function bakeAttachments(sk, bone, sx, sy) {
    if (sx === 1 && sy === 1) return;
    for (const skin of sk.skins) {
      for (const sl of skin.slots) {
        const raw = sk.slots[sl.slotIndex];
        const slotBone = raw ? slotBoneIndex(raw) : -1;
        for (const a of sl.atts) {
          const att = a.att;
          if (att.type === "region" && slotBone === bone) {
            mulFloat(att.x, sx);
            mulFloat(att.y, sy);
            mulFloat(att.width, sx);
            mulFloat(att.height, sy);
          } else if (att.type === "point" && slotBone === bone) {
            mulFloat(att.x, sx);
            mulFloat(att.y, sy);
          } else if (att.type === "mesh" || att.type === "bbox" || att.type === "path" || att.type === "clip") {
            if (att.weighted && att.bones) scaleInfluences(att.bones, att.verts, bone, sx, sy);
            else if (!att.weighted && slotBone === bone) {
              for (let v = 0; v + 1 < att.verts.length; v += 2) {
                mulFloat(att.verts[v], sx);
                mulFloat(att.verts[v + 1], sy);
              }
              if (att.type === "path") for (const len of att.lengths) mulFloat(len, sx);
            }
          }
        }
      }
    }
  }
  function scaleBoneTranslate(sk, boneIndex, sx, sy) {
    if (sx === 1 && sy === 1) return;
    for (const anim of sk.animations) {
      for (const g of anim.bones) {
        if (g.boneIndex !== boneIndex) continue;
        for (const it of g.items) {
          if (it.type === 1) scaleCurveValues(it.curves, sx, sy, "mul");
          else if (it.type === 2) scaleCurveValues(it.curves, sx, 1, "mul");
          else if (it.type === 3) scaleCurveValues(it.curves, 1, sy, "mul");
        }
      }
    }
  }
  function scaleBoneScaleKeys(sk, boneIndex, sx, sy) {
    if (Math.abs(sx - 1) < 1e-8 && Math.abs(sy - 1) < 1e-8) return;
    for (const anim of sk.animations) {
      for (const g of anim.bones) {
        if (g.boneIndex !== boneIndex) continue;
        for (const it of g.items) {
          if (it.type === 4) scaleCurveValues(it.curves, sx, sy, "div");
        }
      }
    }
  }
  function bakeSkelScales(sk) {
    const n = sk.bones.length;
    const kids = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      const p = sk.bones[i].parent;
      if (p != null) kids[p].push(i);
    }
    const orig = sk.bones.map((b) => ({ sx: floatOf(b.scaleX), sy: floatOf(b.scaleY) }));
    const order = [];
    const seen = /* @__PURE__ */ new Set();
    const dfs = (i) => {
      if (seen.has(i)) return;
      seen.add(i);
      const p = sk.bones[i].parent;
      if (p != null) dfs(p);
      order.push(i);
    };
    for (let i = 0; i < n; i++) dfs(i);
    for (const i of order) {
      const b = sk.bones[i];
      const sx = floatOf(b.scaleX);
      const sy = floatOf(b.scaleY);
      mulFloat(b.length, sx);
      bakeAttachments(sk, i, sx, sy);
      for (const c of kids[i]) {
        const ch = sk.bones[c];
        if (ch.inherit !== 0) continue;
        mulFloat(ch.x, sx);
        mulFloat(ch.y, sy);
        mulFloat(ch.scaleX, sx);
        mulFloat(ch.scaleY, sy);
        scaleBoneTranslate(sk, c, sx, sy);
      }
      scaleBoneScaleKeys(sk, i, orig[i].sx, orig[i].sy);
      if (floatOf(b.scaleX) !== 1) setFloat(b.scaleX, 1);
      if (floatOf(b.scaleY) !== 1) setFloat(b.scaleY, 1);
    }
  }
  function boneWorlds(bones) {
    const world = [];
    const resolve = (i) => {
      if (world[i]) return world[i];
      const b = bones[i];
      const parent = b.parent == null ? { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 } : resolve(b.parent);
      const lx = floatOf(b.x);
      const ly = floatOf(b.y);
      const rot = floatOf(b.rotation) * Math.PI / 180;
      const lsx = floatOf(b.scaleX);
      const lsy = floatOf(b.scaleY);
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const la = cos * lsx;
      const lb = sin * lsx;
      const lc = -sin * lsy;
      const ld = cos * lsy;
      const w = {
        x: parent.x + parent.a * lx + parent.b * ly,
        y: parent.y + parent.c * lx + parent.d * ly,
        a: parent.a * la + parent.b * lc,
        b: parent.a * lb + parent.b * ld,
        c: parent.c * la + parent.d * lc,
        d: parent.c * lb + parent.d * ld
      };
      world[i] = w;
      return w;
    };
    for (let i = 0; i < bones.length; i++) resolve(i);
    return world;
  }
  function emptyAabb() {
    return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, width: 0, height: 0 };
  }
  function finishAabb(box) {
    if (!Number.isFinite(box.minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    box.width = box.maxX - box.minX;
    box.height = box.maxY - box.minY;
    return box;
  }
  function addPt(box, x, y) {
    if (x < box.minX) box.minX = x;
    if (y < box.minY) box.minY = y;
    if (x > box.maxX) box.maxX = x;
    if (y > box.maxY) box.maxY = y;
  }
  function skelWorldAABB(sk) {
    const world = boneWorlds(sk.bones);
    const box = emptyAabb();
    const xform = (wt, x, y) => {
      addPt(box, wt.x + wt.a * x + wt.b * y, wt.y + wt.c * x + wt.d * y);
    };
    for (const skin of sk.skins) {
      for (const sl of skin.slots) {
        const raw = sk.slots[sl.slotIndex];
        const slotBone = raw ? slotBoneIndex(raw) : 0;
        const wt = world[slotBone] ?? { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };
        for (const a of sl.atts) {
          const att = a.att;
          if (att.type === "region") {
            const w = floatOf(att.width) * floatOf(att.scaleX);
            const h = floatOf(att.height) * floatOf(att.scaleY);
            const ax = floatOf(att.x);
            const ay = floatOf(att.y);
            const rot = floatOf(att.rotation) * Math.PI / 180;
            const cos = Math.cos(rot);
            const sin = Math.sin(rot);
            const hw = w / 2;
            const hh = h / 2;
            for (const [cx, cy] of [
              [-hw, -hh],
              [hw, -hh],
              [hw, hh],
              [-hw, hh]
            ]) {
              xform(wt, cx * cos - cy * sin + ax, cx * sin + cy * cos + ay);
            }
          } else if (att.type === "mesh" || att.type === "bbox" || att.type === "clip" || att.type === "path") {
            if (att.weighted && att.bones) {
              let bi = 0;
              let vi = 0;
              while (bi < att.bones.length) {
                const bc = att.bones[bi++];
                let wx = 0;
                let wy = 0;
                for (let k = 0; k < bc; k++) {
                  const b = att.bones[bi++];
                  const x = floatOf(att.verts[vi++]);
                  const y = floatOf(att.verts[vi++]);
                  const wgt = floatOf(att.verts[vi++]);
                  const bw = world[b] ?? wt;
                  wx += (bw.x + bw.a * x + bw.b * y) * wgt;
                  wy += (bw.y + bw.c * x + bw.d * y) * wgt;
                }
                addPt(box, wx, wy);
              }
            } else {
              for (let v = 0; v + 1 < att.verts.length; v += 2) xform(wt, floatOf(att.verts[v]), floatOf(att.verts[v + 1]));
            }
          } else if (att.type === "point") {
            xform(wt, floatOf(att.x), floatOf(att.y));
          }
        }
      }
    }
    if (!Number.isFinite(box.minX)) for (const w of world) addPt(box, w.x, w.y);
    return finishAabb(box);
  }

  // ../../mods/node_modules/pako/dist/pako.mjs
  var Z_FIXED = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN = 2;
  function zero$1(buf) {
    let len = buf.length;
    while (--len >= 0) buf[len] = 0;
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = 286;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE$1 = 573;
  var MAX_BITS = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0
  ]);
  var extra_dbits = new Uint8Array([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13
  ]);
  var extra_blbits = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2,
    3,
    7
  ]);
  var bl_order = new Uint8Array([
    16,
    17,
    18,
    0,
    8,
    7,
    9,
    6,
    10,
    5,
    11,
    4,
    12,
    3,
    13,
    2,
    14,
    1,
    15
  ]);
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array(288 * 2);
  zero$1(static_ltree);
  var static_dtree = new Array(D_CODES * 2);
  zero$1(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  var _length_code = new Array(256);
  zero$1(_length_code);
  var base_length = new Array(LENGTH_CODES);
  zero$1(base_length);
  var base_dist = new Array(D_CODES);
  zero$1(base_dist);
  var StaticTreeDesc = class {
    constructor(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
  };
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  var TreeDesc = class {
    constructor(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
  };
  var d_code = (dist) => {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };
  var put_short = (s, w) => {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  };
  var send_bits = (s, value, length) => {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  };
  var send_code = (s, c, tree) => {
    send_bits(s, tree[c * 2], tree[c * 2 + 1]);
  };
  var bi_reverse = (code, len) => {
    let res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };
  var bi_flush = (s) => {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };
  var gen_bitlen = (s, desc) => {
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h;
    let n, m;
    let bits;
    let xbits;
    let f;
    let overflow = 0;
    for (bits = 0; bits <= MAX_BITS; bits++) s.bl_count[bits] = 0;
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) continue;
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) xbits = extra[n - base];
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
    }
    if (overflow === 0) return;
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) bits--;
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) continue;
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  };
  var gen_codes = (tree, max_code, bl_count) => {
    const next_code = new Array(16);
    let code = 0;
    let bits;
    let n;
    for (bits = 1; bits <= MAX_BITS; bits++) {
      code = code + bl_count[bits - 1] << 1;
      next_code[bits] = code;
    }
    for (n = 0; n <= max_code; n++) {
      let len = tree[n * 2 + 1];
      if (len === 0) continue;
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  };
  var tr_static_init = () => {
    let n;
    let bits;
    let length;
    let code;
    let dist;
    const bl_count = new Array(16);
    length = 0;
    for (code = 0; code < LENGTH_CODES - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
    }
    dist >>= 7;
    for (; code < D_CODES; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) _dist_code[256 + dist++] = code;
    }
    for (bits = 0; bits <= MAX_BITS; bits++) bl_count[bits] = 0;
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, 287, bl_count);
    for (n = 0; n < D_CODES; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, 257, L_CODES, MAX_BITS);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
  };
  var init_block = (s) => {
    let n;
    for (n = 0; n < L_CODES; n++) s.dyn_ltree[n * 2] = 0;
    for (n = 0; n < D_CODES; n++) s.dyn_dtree[n * 2] = 0;
    for (n = 0; n < BL_CODES; n++) s.bl_tree[n * 2] = 0;
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  };
  var bi_windup = (s) => {
    if (s.bi_valid > 8) put_short(s, s.bi_buf);
    else if (s.bi_valid > 0) s.pending_buf[s.pending++] = s.bi_buf;
    s.bi_buf = 0;
    s.bi_valid = 0;
  };
  var smaller = (tree, n, m, depth) => {
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  };
  var pqdownheap = (s, tree, k) => {
    const v = s.heap[k];
    let j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
      if (smaller(tree, v, s.heap[j], s.depth)) break;
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  };
  var compress_block = (s, ltree, dtree) => {
    let dist;
    let lc;
    let sx = 0;
    let code;
    let extra;
    if (s.sym_next !== 0) do {
      dist = s.pending_buf[s.sym_buf + sx++] & 255;
      dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) send_code(s, lc, ltree);
      else {
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree);
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);
        }
        dist--;
        code = d_code(dist);
        send_code(s, code, dtree);
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);
        }
      }
    } while (sx < s.sym_next);
    send_code(s, END_BLOCK, ltree);
  };
  var build_tree = (s, desc) => {
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m;
    let max_code = -1;
    let node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) if (tree[n * 2] !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;
    } else tree[n * 2 + 1] = 0;
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) s.static_len -= stree[node * 2 + 1];
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);
    node = elems;
    do {
      n = s.heap[1];
      s.heap[1] = s.heap[s.heap_len--];
      pqdownheap(s, tree, 1);
      m = s.heap[1];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[1] = node++;
      pqdownheap(s, tree, 1);
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  };
  var scan_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) continue;
      else if (count < min_count) s.bl_tree[curlen * 2] += count;
      else if (curlen !== 0) {
        if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) s.bl_tree[REPZ_3_10 * 2]++;
      else s.bl_tree[REPZ_11_138 * 2]++;
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var send_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) continue;
      else if (count < min_count) do
        send_code(s, curlen, s.bl_tree);
      while (--count !== 0);
      else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var build_bl_tree = (s) => {
    let max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) break;
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  };
  var send_all_trees = (s, lcodes, dcodes, blcodes) => {
    let rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  };
  var detect_data_type = (s) => {
    let block_mask = 4093624447;
    let n;
    for (n = 0; n <= 31; n++, block_mask >>>= 1) if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) return Z_BINARY;
    if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return Z_TEXT;
    for (n = 32; n < LITERALS; n++) if (s.dyn_ltree[n * 2] !== 0) return Z_TEXT;
    return Z_BINARY;
  };
  var static_init_done = false;
  var _tr_init = (s) => {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  };
  var _tr_stored_block = (s, buf, stored_len, last) => {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    bi_windup(s);
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    s.pending += stored_len;
  };
  var _tr_align = (s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };
  var _tr_flush_block = (s, buf, stored_len, last) => {
    let opt_lenb, static_lenb;
    let max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN) s.strm.data_type = detect_data_type(s);
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb || s.strategy === Z_FIXED) opt_lenb = static_lenb;
    } else opt_lenb = static_lenb = stored_len + 5;
    if (stored_len + 4 <= opt_lenb && buf !== -1) _tr_stored_block(s, buf, stored_len, last);
    else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) bi_windup(s);
  };
  var _tr_tally = (s, dist, lc) => {
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) s.dyn_ltree[lc * 2]++;
    else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
  };
  var adler32 = (adler, buf, len, pos) => {
    let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var makeTable = () => {
    let c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      table[n] = c;
    }
    return table;
  };
  var crcTable = new Uint32Array(makeTable());
  var crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    return crc ^ -1;
  };
  var messages_default = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
  };
  var MAX_MEM_LEVEL = 9;
  var HEAP_SIZE = 573;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = 262;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var GZIP_STATE = 57;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  var err = (strm, errorCode) => {
    strm.msg = messages_default[errorCode];
    return errorCode;
  };
  var rank = (f) => {
    return f * 2 - (f > 4 ? 9 : 0);
  };
  var zero = (buf) => {
    let len = buf.length;
    while (--len >= 0) buf[len] = 0;
  };
  var slide_hash = (s) => {
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
  };
  var HASH = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
  var INSERT_STRING = (s, str) => {
    let h;
    if (s.legacy_hash) h = s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
    else {
      const w = s.window;
      const value = w[str] | w[str + 1] << 8 | w[str + 2] << 16 | w[str + 3] << 24;
      h = s.ins_h = Math.imul(value, 66521) + 66521 >>> 16 & s.hash_mask;
    }
    const hash_head = s.prev[str & s.w_mask] = s.head[h];
    s.head[h] = str;
    return hash_head;
  };
  var flush_pending = (strm) => {
    const s = strm.state;
    let len = s.pending;
    if (len > strm.avail_out) len = strm.avail_out;
    if (len === 0) return;
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) s.pending_out = 0;
  };
  var flush_block_only = (s, last) => {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };
  var put_byte = (s, b) => {
    s.pending_buf[s.pending++] = b;
  };
  var putShortMSB = (s, b) => {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  };
  var read_buf = (strm, buf, start, size2) => {
    let len = strm.avail_in;
    if (len > size2) len = size2;
    if (len === 0) return 0;
    strm.avail_in -= len;
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) strm.adler = adler32(strm.adler, buf, len, start);
    else if (strm.state.wrap === 2) strm.adler = crc32(strm.adler, buf, len, start);
    strm.next_in += len;
    strm.total_in += len;
    return len;
  };
  var longest_match = (s, cur_match) => {
    let chain_length = s.max_chain_length;
    let scan = s.strstart;
    let match;
    let len;
    let best_len = s.prev_length;
    let nice_match = s.nice_match;
    const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    const _win = s.window;
    const wmask = s.w_mask;
    const prev = s.prev;
    const strend = s.strstart + MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) chain_length >>= 2;
    if (nice_match > s.lookahead) nice_match = s.lookahead;
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
      scan += 2;
      match++;
      do
        ;
      while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) break;
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) return best_len;
    return s.lookahead;
  };
  var fill_window = (s) => {
    const _w_size = s.w_size;
    let n, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        if (s.insert > s.strstart) s.insert = s.strstart;
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) break;
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (!s.legacy_hash) {
        if (s.lookahead + s.insert > MIN_MATCH) {
          str = s.strstart - s.insert;
          while (s.insert) {
            INSERT_STRING(s, str);
            str++;
            s.insert--;
            if (s.lookahead + s.insert <= MIN_MATCH) break;
          }
        }
      } else if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        while (s.insert) {
          INSERT_STRING(s, str);
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) break;
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  };
  var deflate_stored = (s, flush) => {
    let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
      len = 65535;
      have = s.bi_valid + 42 >> 3;
      if (s.strm.avail_out < have) break;
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start;
      if (len > left + s.strm.avail_in) len = left + s.strm.avail_in;
      if (len > have) len = have;
      if (len < min_block && (len === 0 && flush !== 4 || flush === 0 || len !== left + s.strm.avail_in)) break;
      last = flush === 4 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;
      flush_pending(s.strm);
      if (left) {
        if (left > len) left = len;
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);
    used -= s.strm.avail_in;
    if (used) {
      if (used >= s.w_size) {
        s.matches = 2;
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) s.matches++;
          if (s.insert > s.strstart) s.insert = s.strstart;
        }
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) s.high_water = s.strstart;
    if (last) return BS_FINISH_DONE;
    if (flush !== 0 && flush !== 4 && s.strm.avail_in === 0 && s.strstart === s.block_start) return BS_BLOCK_DONE;
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) s.matches++;
      have += s.w_size;
      if (s.insert > s.strstart) s.insert = s.strstart;
    }
    if (have > s.strm.avail_in) have = s.strm.avail_in;
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) s.high_water = s.strstart;
    have = s.bi_valid + 42 >> 3;
    have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === 4) && flush !== 0 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === 4 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  };
  var deflate_fast = (s, flush) => {
    let hash_head;
    let bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === 0) return BS_NEED_MORE;
        if (s.lookahead === 0) break;
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) hash_head = INSERT_STRING(s, s.strstart);
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) s.match_length = longest_match(s, hash_head);
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            hash_head = INSERT_STRING(s, s.strstart);
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          if (s.legacy_hash) {
            s.ins_h = s.window[s.strstart];
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
          }
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) return BS_NEED_MORE;
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === 4) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
    return BS_BLOCK_DONE;
  };
  var deflate_slow = (s, flush) => {
    let hash_head;
    let bflush;
    let max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === 0) return BS_NEED_MORE;
        if (s.lookahead === 0) break;
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) hash_head = INSERT_STRING(s, s.strstart);
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === 1 || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) s.match_length = MIN_MATCH - 1;
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do
          if (++s.strstart <= max_insert) hash_head = INSERT_STRING(s, s.strstart);
        while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) return BS_NEED_MORE;
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush)
          flush_block_only(s, false);
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) return BS_NEED_MORE;
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === 4) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
    return BS_BLOCK_DONE;
  };
  var deflate_rle = (s, flush) => {
    let bflush;
    let prev;
    let scan, strend;
    const _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === 0) return BS_NEED_MORE;
        if (s.lookahead === 0) break;
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do
            ;
          while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) s.match_length = s.lookahead;
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) return BS_NEED_MORE;
      }
    }
    s.insert = 0;
    if (flush === 4) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
    return BS_BLOCK_DONE;
  };
  var deflate_huff = (s, flush) => {
    let bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === 0) return BS_NEED_MORE;
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) return BS_NEED_MORE;
      }
    }
    s.insert = 0;
    if (flush === 4) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
    return BS_BLOCK_DONE;
  };
  var Config = class {
    constructor(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
  };
  var configuration_table = [
    new Config(0, 0, 0, 0, deflate_stored),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow)
  ];
  var lm_init = (s) => {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };
  var DeflateState = class {
    constructor() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = 8;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.legacy_hash = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
      this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122);
      this.bl_tree = /* @__PURE__ */ new Uint16Array(78);
      zero(this.dyn_ltree);
      zero(this.dyn_dtree);
      zero(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = /* @__PURE__ */ new Uint16Array(16);
      this.heap = /* @__PURE__ */ new Uint16Array(573);
      zero(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = /* @__PURE__ */ new Uint16Array(573);
      zero(this.depth);
      this.sym_buf = 0;
      this.lit_bufsize = 0;
      this.sym_next = 0;
      this.sym_end = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
  };
  var deflateStateCheck = (strm) => {
    if (!strm) return 1;
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE && s.status !== GZIP_STATE && s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) return 1;
    return 0;
  };
  var deflateResetKeep = (strm) => {
    if (deflateStateCheck(strm)) return err(strm, -2);
    strm.total_in = strm.total_out = 0;
    strm.data_type = 2;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) s.wrap = -s.wrap;
    s.status = s.wrap === 2 ? GZIP_STATE : s.wrap ? INIT_STATE : BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = -2;
    _tr_init(s);
    return 0;
  };
  var deflateReset = (strm) => {
    const ret = deflateResetKeep(strm);
    if (ret === 0) lm_init(strm.state);
    return ret;
  };
  var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy, legacyHash) => {
    if (!strm) return -2;
    let wrap = 1;
    if (level === -1) level = 6;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== 8 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > 4 || windowBits === 8 && wrap !== 1) return err(strm, -2);
    if (windowBits === 8) windowBits = 9;
    const s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.legacy_hash = legacyHash ? 1 : 0;
    s.hash_bits = memLevel + 7;
    if (!s.legacy_hash && s.hash_bits < 15) s.hash_bits = 15;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    s.sym_buf = s.lit_bufsize;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  };
  var deflate$1 = (strm, flush) => {
    if (deflateStateCheck(strm) || flush > 5 || flush < 0) return strm ? err(strm, -2) : -2;
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== 4) return err(strm, strm.avail_out === 0 ? -5 : -2);
    const old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return 0;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== 4) return err(strm, -5);
    if (s.status === FINISH_STATE && strm.avail_in !== 0) return err(strm, -5);
    if (s.status === INIT_STATE && s.wrap === 0) s.status = BUSY_STATE;
    if (s.status === INIT_STATE) {
      let header = 8 + (s.w_bits - 8 << 4) << 8;
      let level_flags = -1;
      if (s.strategy >= 2 || s.level < 2) level_flags = 0;
      else if (s.level < 6) level_flags = 1;
      else if (s.level === 6) level_flags = 2;
      else level_flags = 3;
      header |= level_flags << 6;
      if (s.strstart !== 0) header |= PRESET_DICT;
      header += 31 - header % 31;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return 0;
      }
    }
    if (s.status === GZIP_STATE) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return 0;
        }
      } else {
        put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        let beg = s.pending;
        let left = (s.gzhead.extra.length & 65535) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          let copy = s.pending_buf_size - s.pending;
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return 0;
          }
          beg = 0;
          left -= copy;
        }
        let gzhead_extra = new Uint8Array(s.gzhead.extra);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return 0;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          else val = 0;
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return 0;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          else val = 0;
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return 0;
          }
        }
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
      }
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return 0;
      }
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== 0 && s.status !== FINISH_STATE) {
      let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === 2 ? deflate_huff(s, flush) : s.strategy === 3 ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) s.last_flush = -1;
        return 0;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === 1) _tr_align(s);
        else if (flush !== 5) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === 3) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return 0;
        }
      }
    }
    if (flush !== 4) return 0;
    if (s.wrap <= 0) return 1;
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) s.wrap = -s.wrap;
    return s.pending !== 0 ? 0 : 1;
  };
  var deflateEnd = (strm) => {
    if (deflateStateCheck(strm)) return -2;
    const status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, -3) : 0;
  };
  var deflateSetDictionary = (strm, dictionary) => {
    let dictLength = dictionary.length;
    if (deflateStateCheck(strm)) return -2;
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) return -2;
    if (wrap === 1) strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input2 = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH - 1);
      do {
        INSERT_STRING(s, str);
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input2;
    strm.avail_in = avail;
    s.wrap = wrap;
    return 0;
  };
  var BAD$1 = 16209;
  var TYPE$1 = 16191;
  function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input2, output;
    const state = strm.state;
    _in = strm.next_in;
    input2 = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top: do {
      if (bits < 15) {
        hold += input2[_in++] << bits;
        bits += 8;
        hold += input2[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen: for (; ; ) {
        op = here >>> 24;
        hold >>>= op;
        bits -= op;
        op = here >>> 16 & 255;
        if (op === 0) output[_out++] = here & 65535;
        else if (op & 16) {
          len = here & 65535;
          op &= 15;
          if (op) {
            if (bits < op) {
              hold += input2[_in++] << bits;
              bits += 8;
            }
            len += hold & (1 << op) - 1;
            hold >>>= op;
            bits -= op;
          }
          if (bits < 15) {
            hold += input2[_in++] << bits;
            bits += 8;
            hold += input2[_in++] << bits;
            bits += 8;
          }
          here = dcode[hold & dmask];
          dodist: for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op & 16) {
              dist = here & 65535;
              op &= 15;
              if (bits < op) {
                hold += input2[_in++] << bits;
                bits += 8;
                if (bits < op) {
                  hold += input2[_in++] << bits;
                  bits += 8;
                }
              }
              dist += hold & (1 << op) - 1;
              if (dist > dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD$1;
                break top;
              }
              hold >>>= op;
              bits -= op;
              op = _out - beg;
              if (dist > op) {
                op = dist - op;
                if (op > whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD$1;
                    break top;
                  }
                }
                from = 0;
                from_source = s_window;
                if (wnext === 0) {
                  from += wsize - op;
                  if (op < len) {
                    len -= op;
                    do
                      output[_out++] = s_window[from++];
                    while (--op);
                    from = _out - dist;
                    from_source = output;
                  }
                } else if (wnext < op) {
                  from += wsize + wnext - op;
                  op -= wnext;
                  if (op < len) {
                    len -= op;
                    do
                      output[_out++] = s_window[from++];
                    while (--op);
                    from = 0;
                    if (wnext < len) {
                      op = wnext;
                      len -= op;
                      do
                        output[_out++] = s_window[from++];
                      while (--op);
                      from = _out - dist;
                      from_source = output;
                    }
                  }
                } else {
                  from += wnext - op;
                  if (op < len) {
                    len -= op;
                    do
                      output[_out++] = s_window[from++];
                    while (--op);
                    from = _out - dist;
                    from_source = output;
                  }
                }
                while (len > 2) {
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  len -= 3;
                }
                if (len) {
                  output[_out++] = from_source[from++];
                  if (len > 1) output[_out++] = from_source[from++];
                }
              } else {
                from = _out - dist;
                do {
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  len -= 3;
                } while (len > 2);
                if (len) {
                  output[_out++] = output[from++];
                  if (len > 1) output[_out++] = output[from++];
                }
              }
            } else if ((op & 64) === 0) {
              here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dodist;
            } else {
              strm.msg = "invalid distance code";
              state.mode = BAD$1;
              break top;
            }
            break;
          }
        } else if ((op & 64) === 0) {
          here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
          continue dolen;
        } else if (op & 32) {
          state.mode = TYPE$1;
          break top;
        } else {
          strm.msg = "invalid literal/length code";
          state.mode = BAD$1;
          break top;
        }
        break;
      }
    } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
  }
  var MAXBITS = 15;
  var ENOUGH_LENS$1 = 852;
  var ENOUGH_DISTS$1 = 592;
  var CODES$1 = 0;
  var LENS$1 = 1;
  var DISTS$1 = 2;
  var lbase = new Uint16Array([
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]);
  var lext = new Uint8Array([
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    199,
    75
  ]);
  var dbase = new Uint16Array([
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]);
  var dext = new Uint8Array([
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]);
  var inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0, max = 0;
    let root = 0;
    let curr = 0;
    let drop2 = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base = null;
    let match;
    const count = /* @__PURE__ */ new Uint16Array(16);
    const offs = /* @__PURE__ */ new Uint16Array(16);
    let extra = null;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) count[len] = 0;
    for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;
    root = bits;
    for (max = MAXBITS; max >= 1; max--) if (count[max] !== 0) break;
    if (root > max) root = max;
    if (max === 0) {
      table[table_index++] = 20971520;
      table[table_index++] = 20971520;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) if (count[min] !== 0) break;
    if (root < min) root = min;
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) return -1;
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) return -1;
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) offs[len + 1] = offs[len] + count[len];
    for (sym = 0; sym < codes; sym++) if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
    if (type === CODES$1) {
      base = extra = work;
      match = 20;
    } else if (type === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;
    } else {
      base = dbase;
      extra = dext;
      match = 0;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop2 = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) return 1;
    for (; ; ) {
      here_bits = len - drop2;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      } else {
        here_op = 96;
        here_val = 0;
      }
      incr = 1 << len - drop2;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop2) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) incr >>= 1;
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else huff = 0;
      sym++;
      if (--count[len] === 0) {
        if (len === max) break;
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop2 === 0) drop2 = root;
        next += min;
        curr = len - drop2;
        left = 1 << curr;
        while (curr + drop2 < max) {
          left -= count[curr + drop2];
          if (left <= 0) break;
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) return 1;
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) table[next + huff] = len - drop2 << 24 | 4194304;
    opts.bits = root;
    return 0;
  };
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var HEAD = 16180;
  var FLAGS = 16181;
  var TIME = 16182;
  var OS = 16183;
  var EXLEN = 16184;
  var EXTRA = 16185;
  var NAME = 16186;
  var COMMENT = 16187;
  var HCRC = 16188;
  var DICTID = 16189;
  var DICT = 16190;
  var TYPE = 16191;
  var TYPEDO = 16192;
  var STORED = 16193;
  var COPY_ = 16194;
  var COPY = 16195;
  var TABLE = 16196;
  var LENLENS = 16197;
  var CODELENS = 16198;
  var LEN_ = 16199;
  var LEN = 16200;
  var LENEXT = 16201;
  var DIST = 16202;
  var DISTEXT = 16203;
  var MATCH = 16204;
  var LIT = 16205;
  var CHECK = 16206;
  var LENGTH = 16207;
  var DONE = 16208;
  var BAD = 16209;
  var MEM = 16210;
  var SYNC = 16211;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var zswap32 = (q) => {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  };
  var InflateState = class {
    constructor() {
      this.strm = null;
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = /* @__PURE__ */ new Uint16Array(320);
      this.work = /* @__PURE__ */ new Uint16Array(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
  };
  var inflateStateCheck = (strm) => {
    if (!strm) return 1;
    const state = strm.state;
    if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) return 1;
    return 0;
  };
  var inflateResetKeep = (strm) => {
    if (inflateStateCheck(strm)) return -2;
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) strm.adler = state.wrap & 1;
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return 0;
  };
  var inflateReset = (strm) => {
    if (inflateStateCheck(strm)) return -2;
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  };
  var inflateReset2 = (strm, windowBits) => {
    let wrap;
    if (inflateStateCheck(strm)) return -2;
    const state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) windowBits &= 15;
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) return -2;
    if (state.window !== null && state.wbits !== windowBits) state.window = null;
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };
  var inflateInit2 = (strm, windowBits) => {
    if (!strm) return -2;
    const state = new InflateState();
    strm.state = state;
    state.strm = strm;
    state.window = null;
    state.mode = HEAD;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== 0) strm.state = null;
    return ret;
  };
  var virgin = true;
  var lenfix;
  var distfix;
  var fixedtables = (state) => {
    if (virgin) {
      lenfix = /* @__PURE__ */ new Int32Array(512);
      distfix = /* @__PURE__ */ new Int32Array(32);
      let sym = 0;
      while (sym < 144) state.lens[sym++] = 8;
      while (sym < 256) state.lens[sym++] = 9;
      while (sym < 280) state.lens[sym++] = 7;
      while (sym < 288) state.lens[sym++] = 8;
      inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) state.lens[sym++] = 5;
      inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };
  var updatewindow = (strm, src, end, copy) => {
    let dist;
    const state = strm.state;
    if (state.window === null) state.window = new Uint8Array(1 << state.wbits);
    if (state.wsize === 0) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
    }
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) dist = copy;
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) state.wnext = 0;
        if (state.whave < state.wsize) state.whave += dist;
      }
    }
    return 0;
  };
  var inflate$1 = (strm, flush) => {
    let state;
    let input2, output;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = /* @__PURE__ */ new Uint8Array(4);
    let opts;
    let n;
    const order = new Uint8Array([
      16,
      17,
      18,
      0,
      8,
      7,
      9,
      6,
      10,
      5,
      11,
      4,
      12,
      3,
      13,
      2,
      14,
      1,
      15
    ]);
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) return -2;
    state = strm.state;
    if (state.mode === TYPE) state.mode = TYPEDO;
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input2 = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = 0;
    inf_leave: for (; ; ) switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        while (bits < 16) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        if (state.wrap & 2 && hold === 35615) {
          if (state.wbits === 0) state.wbits = 15;
          state.check = 0;
          hbuf[0] = hold & 255;
          hbuf[1] = hold >>> 8 & 255;
          state.check = crc32(state.check, hbuf, 2, 0);
          hold = 0;
          bits = 0;
          state.mode = FLAGS;
          break;
        }
        if (state.head) state.head.done = false;
        if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
          strm.msg = "incorrect header check";
          state.mode = BAD;
          break;
        }
        if ((hold & 15) !== 8) {
          strm.msg = "unknown compression method";
          state.mode = BAD;
          break;
        }
        hold >>>= 4;
        bits -= 4;
        len = (hold & 15) + 8;
        if (state.wbits === 0) state.wbits = len;
        if (len > 15 || len > state.wbits) {
          strm.msg = "invalid window size";
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << state.wbits;
        state.flags = 0;
        strm.adler = state.check = 1;
        state.mode = hold & 512 ? DICTID : TYPE;
        hold = 0;
        bits = 0;
        break;
      case FLAGS:
        while (bits < 16) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        state.flags = hold;
        if ((state.flags & 255) !== 8) {
          strm.msg = "unknown compression method";
          state.mode = BAD;
          break;
        }
        if (state.flags & 57344) {
          strm.msg = "unknown header flags set";
          state.mode = BAD;
          break;
        }
        if (state.head) state.head.text = hold >> 8 & 1;
        if (state.flags & 512 && state.wrap & 4) {
          hbuf[0] = hold & 255;
          hbuf[1] = hold >>> 8 & 255;
          state.check = crc32(state.check, hbuf, 2, 0);
        }
        hold = 0;
        bits = 0;
        state.mode = TIME;
      case TIME:
        while (bits < 32) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        if (state.head) state.head.time = hold >>> 0;
        if (state.flags & 512 && state.wrap & 4) {
          hbuf[0] = hold & 255;
          hbuf[1] = hold >>> 8 & 255;
          hbuf[2] = hold >>> 16 & 255;
          hbuf[3] = hold >>> 24 & 255;
          state.check = crc32(state.check, hbuf, 4, 0);
        }
        hold = 0;
        bits = 0;
        state.mode = OS;
      case OS:
        while (bits < 16) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        if (state.head) {
          state.head.xflags = hold & 255;
          state.head.os = hold >> 8;
        }
        if (state.flags & 512 && state.wrap & 4) {
          hbuf[0] = hold & 255;
          hbuf[1] = hold >>> 8 & 255;
          state.check = crc32(state.check, hbuf, 2, 0);
        }
        hold = 0;
        bits = 0;
        state.mode = EXLEN;
      case EXLEN:
        if (state.flags & 1024) {
          while (bits < 16) {
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          state.length = hold;
          if (state.head) state.head.extra_len = hold;
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
        } else if (state.head) state.head.extra = null;
        state.mode = EXTRA;
      case EXTRA:
        if (state.flags & 1024) {
          copy = state.length;
          if (copy > have) copy = have;
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) state.head.extra = new Uint8Array(state.head.extra_len);
              state.head.extra.set(input2.subarray(next, next + copy), len);
            }
            if (state.flags & 512 && state.wrap & 4) state.check = crc32(state.check, input2, copy, next);
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) break inf_leave;
        }
        state.length = 0;
        state.mode = NAME;
      case NAME:
        if (state.flags & 2048) {
          if (have === 0) break inf_leave;
          copy = 0;
          do {
            len = input2[next + copy++];
            if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
          } while (len && copy < have);
          if (state.flags & 512 && state.wrap & 4) state.check = crc32(state.check, input2, copy, next);
          have -= copy;
          next += copy;
          if (len) break inf_leave;
        } else if (state.head) state.head.name = null;
        state.length = 0;
        state.mode = COMMENT;
      case COMMENT:
        if (state.flags & 4096) {
          if (have === 0) break inf_leave;
          copy = 0;
          do {
            len = input2[next + copy++];
            if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
          } while (len && copy < have);
          if (state.flags & 512 && state.wrap & 4) state.check = crc32(state.check, input2, copy, next);
          have -= copy;
          next += copy;
          if (len) break inf_leave;
        } else if (state.head) state.head.comment = null;
        state.mode = HCRC;
      case HCRC:
        if (state.flags & 512) {
          while (bits < 16) {
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 4 && hold !== (state.check & 65535)) {
            strm.msg = "header crc mismatch";
            state.mode = BAD;
            break;
          }
          hold = 0;
          bits = 0;
        }
        if (state.head) {
          state.head.hcrc = state.flags >> 9 & 1;
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        while (bits < 32) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        strm.adler = state.check = zswap32(hold);
        hold = 0;
        bits = 0;
        state.mode = DICT;
      case DICT:
        if (state.havedict === 0) {
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          return 2;
        }
        strm.adler = state.check = 1;
        state.mode = TYPE;
      case TYPE:
        if (flush === 5 || flush === 6) break inf_leave;
      case TYPEDO:
        if (state.last) {
          hold >>>= bits & 7;
          bits -= bits & 7;
          state.mode = CHECK;
          break;
        }
        while (bits < 3) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        state.last = hold & 1;
        hold >>>= 1;
        bits -= 1;
        switch (hold & 3) {
          case 0:
            state.mode = STORED;
            break;
          case 1:
            fixedtables(state);
            state.mode = LEN_;
            if (flush === 6) {
              hold >>>= 2;
              bits -= 2;
              break inf_leave;
            }
            break;
          case 2:
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = "invalid block type";
            state.mode = BAD;
        }
        hold >>>= 2;
        bits -= 2;
        break;
      case STORED:
        hold >>>= bits & 7;
        bits -= bits & 7;
        while (bits < 32) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
          strm.msg = "invalid stored block lengths";
          state.mode = BAD;
          break;
        }
        state.length = hold & 65535;
        hold = 0;
        bits = 0;
        state.mode = COPY_;
        if (flush === 6) break inf_leave;
      case COPY_:
        state.mode = COPY;
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) copy = have;
          if (copy > left) copy = left;
          if (copy === 0) break inf_leave;
          output.set(input2.subarray(next, next + copy), put);
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        state.mode = TYPE;
        break;
      case TABLE:
        while (bits < 14) {
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        state.nlen = (hold & 31) + 257;
        hold >>>= 5;
        bits -= 5;
        state.ndist = (hold & 31) + 1;
        hold >>>= 5;
        bits -= 5;
        state.ncode = (hold & 15) + 4;
        hold >>>= 4;
        bits -= 4;
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = "too many length or distance symbols";
          state.mode = BAD;
          break;
        }
        state.have = 0;
        state.mode = LENLENS;
      case LENLENS:
        while (state.have < state.ncode) {
          while (bits < 3) {
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          state.lens[order[state.have++]] = hold & 7;
          hold >>>= 3;
          bits -= 3;
        }
        while (state.have < 19) state.lens[order[state.have++]] = 0;
        state.lencode = state.lendyn;
        state.lenbits = 7;
        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;
        if (ret) {
          strm.msg = "invalid code lengths set";
          state.mode = BAD;
          break;
        }
        state.have = 0;
        state.mode = CODELENS;
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (; ; ) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) break;
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          if (here_val < 16) {
            hold >>>= here_bits;
            bits -= here_bits;
            state.lens[state.have++] = here_val;
          } else {
            if (here_val === 16) {
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) break inf_leave;
                have--;
                hold += input2[next++] << bits;
                bits += 8;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              if (state.have === 0) {
                strm.msg = "invalid bit length repeat";
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 3);
              hold >>>= 2;
              bits -= 2;
            } else if (here_val === 17) {
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) break inf_leave;
                have--;
                hold += input2[next++] << bits;
                bits += 8;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              len = 0;
              copy = 3 + (hold & 7);
              hold >>>= 3;
              bits -= 3;
            } else {
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) break inf_leave;
                have--;
                hold += input2[next++] << bits;
                bits += 8;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              len = 0;
              copy = 11 + (hold & 127);
              hold >>>= 7;
              bits -= 7;
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = "invalid bit length repeat";
              state.mode = BAD;
              break;
            }
            while (copy--) state.lens[state.have++] = len;
          }
        }
        if (state.mode === BAD) break;
        if (state.lens[256] === 0) {
          strm.msg = "invalid code -- missing end-of-block";
          state.mode = BAD;
          break;
        }
        state.lenbits = 9;
        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;
        if (ret) {
          strm.msg = "invalid literal/lengths set";
          state.mode = BAD;
          break;
        }
        state.distbits = 6;
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        state.distbits = opts.bits;
        if (ret) {
          strm.msg = "invalid distances set";
          state.mode = BAD;
          break;
        }
        state.mode = LEN_;
        if (flush === 6) break inf_leave;
      case LEN_:
        state.mode = LEN;
      case LEN:
        if (have >= 6 && left >= 258) {
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          inflate_fast(strm, _out);
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input2 = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          if (state.mode === TYPE) state.back = -1;
          break;
        }
        state.back = 0;
        for (; ; ) {
          here = state.lencode[hold & (1 << state.lenbits) - 1];
          here_bits = here >>> 24;
          here_op = here >>> 16 & 255;
          here_val = here & 65535;
          if (here_bits <= bits) break;
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        if (here_op && (here_op & 240) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (; ; ) {
            here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (last_bits + here_bits <= bits) break;
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          hold >>>= last_bits;
          bits -= last_bits;
          state.back += last_bits;
        }
        hold >>>= here_bits;
        bits -= here_bits;
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = "invalid literal/length code";
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
      case LENEXT:
        if (state.extra) {
          n = state.extra;
          while (bits < n) {
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          state.length += hold & (1 << state.extra) - 1;
          hold >>>= state.extra;
          bits -= state.extra;
          state.back += state.extra;
        }
        state.was = state.length;
        state.mode = DIST;
      case DIST:
        for (; ; ) {
          here = state.distcode[hold & (1 << state.distbits) - 1];
          here_bits = here >>> 24;
          here_op = here >>> 16 & 255;
          here_val = here & 65535;
          if (here_bits <= bits) break;
          if (have === 0) break inf_leave;
          have--;
          hold += input2[next++] << bits;
          bits += 8;
        }
        if ((here_op & 240) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (; ; ) {
            here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (last_bits + here_bits <= bits) break;
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          hold >>>= last_bits;
          bits -= last_bits;
          state.back += last_bits;
        }
        hold >>>= here_bits;
        bits -= here_bits;
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = "invalid distance code";
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = here_op & 15;
        state.mode = DISTEXT;
      case DISTEXT:
        if (state.extra) {
          n = state.extra;
          while (bits < n) {
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          state.offset += hold & (1 << state.extra) - 1;
          hold >>>= state.extra;
          bits -= state.extra;
          state.back += state.extra;
        }
        if (state.offset > state.dmax) {
          strm.msg = "invalid distance too far back";
          state.mode = BAD;
          break;
        }
        state.mode = MATCH;
      case MATCH:
        if (left === 0) break inf_leave;
        copy = _out - left;
        if (state.offset > copy) {
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          } else from = state.wnext - copy;
          if (copy > state.length) copy = state.length;
          from_source = state.window;
        } else {
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) copy = left;
        left -= copy;
        state.length -= copy;
        do
          output[put++] = from_source[from++];
        while (--copy);
        if (state.length === 0) state.mode = LEN;
        break;
      case LIT:
        if (left === 0) break inf_leave;
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          while (bits < 32) {
            if (have === 0) break inf_leave;
            have--;
            hold |= input2[next++] << bits;
            bits += 8;
          }
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (state.wrap & 4 && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
          _out = left;
          if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = "incorrect data check";
            state.mode = BAD;
            break;
          }
          hold = 0;
          bits = 0;
        }
        state.mode = LENGTH;
      case LENGTH:
        if (state.wrap && state.flags) {
          while (bits < 32) {
            if (have === 0) break inf_leave;
            have--;
            hold += input2[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
            strm.msg = "incorrect length check";
            state.mode = BAD;
            break;
          }
          hold = 0;
          bits = 0;
        }
        state.mode = DONE;
      case DONE:
        ret = 1;
        break inf_leave;
      case BAD:
        ret = -3;
        break inf_leave;
      case MEM:
        return -4;
      case SYNC:
      default:
        return -2;
    }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== 4)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
        state.mode = MEM;
        return -4;
      }
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === 4) && ret === 0) ret = -5;
    return ret;
  };
  var inflateEnd = (strm) => {
    if (inflateStateCheck(strm)) return -2;
    let state = strm.state;
    if (state.window) state.window = null;
    strm.state = null;
    return 0;
  };
  var inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    if (inflateStateCheck(strm)) return -2;
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) return -2;
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) return -3;
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return -4;
    }
    state.havedict = 1;
    return 0;
  };
  var ZStream = class {
    constructor() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
  };
  var flattenChunks = (chunks) => {
    const result = new Uint8Array(chunks.reduce((len, chunk) => len + chunk.length, 0));
    let pos = 0;
    for (const chunk of chunks) {
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };
  var toString$1 = Object.prototype.toString;
  var defaultOptions$1 = {
    level: -1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: 0,
    raw: false,
    gzip: false,
    legacyHash: false,
    dictionary: /* @__PURE__ */ new Uint8Array(0)
  };
  var Deflate = class {
    options;
    /**
    * Error code after deflate finishes. {@link Z_OK} on success.
    * You will not need it in real life, because deflate errors
    * are possible only on wrong options or bad custom `onData` / `onEnd`
    * handlers.
    */
    err;
    /** Error message, if {@link Deflate.err} is not {@link Z_OK}. */
    msg;
    ended;
    started;
    /**
    * Chunks of output data, if {@link Deflate.onData} not overridden.
    * @internal
    */
    chunks;
    strm;
    /**
    * Compressed result, generated by default {@link Deflate.onData}
    * and {@link Deflate.onEnd} handlers. Filled after you push last chunk
    * (call {@link Deflate.push} with {@link Z_FINISH} / `true` param).
    */
    result;
    /**
    * Creates a new deflator instance with the specified params. Throws an
    * exception on bad params. See {@link DeflateOptions} for the list of
    * supported options.
    *
    * @example
    * ```javascript
    * import { Deflate } from 'pako'
    *
    * const chunk1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    * const chunk2 = new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    *
    * const deflate = new Deflate({ level: 3 })
    *
    * deflate.push(chunk1, false)
    * deflate.push(chunk2, true)  // true -> last chunk
    *
    * if (deflate.err) throw new Error(deflate.err)
    *
    * console.log(deflate.result)
    * ```
    */
    constructor(options = {}) {
      this.options = Object.assign({}, defaultOptions$1, options);
      const opt = this.options;
      if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
      else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.started = false;
      this.chunks = [];
      this.result = /* @__PURE__ */ new Uint8Array(0);
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      let status = deflateInit2(this.strm, opt.level, 8, opt.windowBits, opt.memLevel, opt.strategy, opt.legacyHash);
      if (status !== 0) throw new Error(messages_default[status]);
      if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") opt.dictionary = new Uint8Array(opt.dictionary);
      const dictionary = opt.dictionary;
      if (dictionary.length) {
        if (opt.gzip) throw new Error("dictionary is not supported with gzip");
        status = deflateSetDictionary(this.strm, dictionary);
        if (status !== 0) throw new Error(messages_default[status]);
      }
    }
    /**
    * Sends input data to the deflate pipe, generating {@link Deflate.onData} calls
    * with new compressed chunks. Returns `true` on success. The last data block must
    * have `flush_mode` {@link Z_FINISH} (or `true`). That will flush the internal
    * pending buffers and call {@link Deflate.onEnd}.
    *
    * On failure, calls {@link Deflate.onEnd} with the error code and returns false.
    *
    * @param data input data. Strings will be converted to utf8 byte sequence.
    * @param flush_mode 0..6 for corresponding {@link Z_NO_FLUSH}..{@link Z_TREES} modes.
    *   See constants. Skipped or `false` means {@link Z_NO_FLUSH}, `true` means {@link Z_FINISH}.
    *
    * @example
    * ```javascript
    * push(chunk, false) // push one of data chunks
    * ...
    * push(chunk, true)  // push last chunk
    * ```
    */
    push(data, flush_mode = false) {
      const strm = this.strm;
      const chunkSize = this.options.chunkSize;
      let status;
      let _flush_mode;
      if (this.ended) return false;
      if (typeof flush_mode === "number") _flush_mode = flush_mode;
      else _flush_mode = flush_mode === true ? 4 : 0;
      if (typeof data === "string") strm.input = new TextEncoder().encode(data);
      else if (toString$1.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
      else strm.input = data;
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      if (!this.started) {
        this.started = true;
        this.onStart(strm);
      }
      for (; ; ) {
        if (strm.avail_out === 0) {
          strm.output = new Uint8Array(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        if ((_flush_mode === 2 || _flush_mode === 3) && strm.avail_out <= 6) {
          this.onData(strm.output.subarray(0, strm.next_out));
          strm.avail_out = 0;
          continue;
        }
        status = deflate$1(strm, _flush_mode);
        if (status === -2) break;
        if (status === 1) {
          if (strm.next_out > 0) this.onData(strm.output.subarray(0, strm.next_out));
          status = deflateEnd(this.strm);
          break;
        }
        if (strm.avail_out === 0) {
          this.onData(strm.output);
          continue;
        }
        if (_flush_mode > 0 && strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
          strm.avail_out = 0;
          continue;
        }
        if (strm.avail_in === 0) return true;
      }
      this.err = status;
      this.msg = strm.msg || messages_default[status];
      this.ended = true;
      this.onEnd(status);
      return status === 0;
    }
    /**
    * Called once before the first low-level deflate call.
    */
    onStart(strm) {
    }
    /**
    * By default, stores data blocks in the {@link Deflate.chunks} property and glues
    * them in {@link Deflate.onEnd}. Override this handler if you need another behaviour.
    */
    onData(chunk) {
      this.chunks.push(chunk);
    }
    /**
    * Called once after you tell deflate that the input stream is
    * complete ({@link Z_FINISH}). By default, joins the collected {@link Deflate.chunks}
    * into the {@link Deflate.result} property.
    *
    * @param status deflate status. {@link Z_OK} on success, other if not.
    */
    onEnd(status) {
      if (status === 0) this.result = flattenChunks(this.chunks);
      this.chunks = [];
    }
  };
  function deflate(input2, options = {}) {
    const deflator = new Deflate(options);
    deflator.push(input2, true);
    if (deflator.err) throw new Error(deflator.msg);
    return deflator.result;
  }
  function deflateRaw(input2, options = {}) {
    return deflate(input2, Object.assign({}, options, { raw: true }));
  }
  var toString = Object.prototype.toString;
  var defaultOptions = {
    chunkSize: 1024 * 64,
    windowBits: 15,
    raw: false,
    dictionary: /* @__PURE__ */ new Uint8Array(0)
  };
  var Inflate = class {
    options;
    /**
    * Error code after inflate finishes. {@link Z_OK} on success.
    * Should be checked when broken data is possible.
    */
    err;
    /** Error message, if {@link Inflate.err} is not {@link Z_OK}. */
    msg;
    /**
    * `true` once the compressed stream has ended. A stream may end before the
    * caller's data does (trailing bytes), so check this to know when to stop
    * pushing - further {@link Inflate.push} calls are no-ops.
    */
    ended;
    started;
    /**
    * Chunks of output data, if {@link Inflate.onData} not overridden.
    * @internal
    */
    chunks;
    strm;
    /**
    * Uncompressed result, generated by default {@link Inflate.onData}
    * and {@link Inflate.onEnd} handlers. Filled after you push last chunk
    * (call {@link Inflate.push} with {@link Z_FINISH} / `true` param).
    */
    result;
    /**
    * Creates a new inflator instance with the specified params. Throws an
    * exception on bad params. See {@link InflateOptions} for the list of
    * supported options.
    *
    * By default, when no options are set, the deflate/gzip data format is
    * autodetected via the wrapper header.
    *
    * @example
    * ```javascript
    * import { Inflate } from 'pako'
    *
    * const chunk1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    * const chunk2 = new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    *
    * const inflate = new Inflate({ level: 3 })
    *
    * inflate.push(chunk1, false)
    * inflate.push(chunk2, true)  // true -> last chunk
    *
    * if (inflate.err) throw new Error(inflate.err)
    *
    * console.log(inflate.result)
    * ```
    */
    constructor(options = {}) {
      this.options = Object.assign({}, defaultOptions, options);
      const opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) opt.windowBits = -15;
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !options.windowBits) opt.windowBits += 32;
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.started = false;
      this.chunks = [];
      this.result = /* @__PURE__ */ new Uint8Array(0);
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      let status = inflateInit2(this.strm, opt.windowBits);
      if (status !== 0) throw new Error(messages_default[status]);
      if (toString.call(opt.dictionary) === "[object ArrayBuffer]") opt.dictionary = new Uint8Array(opt.dictionary);
      const dictionary = opt.dictionary;
      if (opt.raw && dictionary.length) {
        status = inflateSetDictionary(this.strm, dictionary);
        if (status !== 0) throw new Error(messages_default[status]);
      }
    }
    /**
    * Sends input data to the inflate pipe, generating {@link Inflate.onData} calls
    * with new output chunks. Returns `true` on success. If end of stream is
    * detected, {@link Inflate.onEnd} will be called.
    *
    * `flush_mode` is not needed for normal operation, because end of stream
    * is detected automatically. Pass {@link Z_SYNC_FLUSH} to force the decoder
    * to emit all currently available output — handy when you need to decode
    * data frame-by-frame from a long-running stream.
    *
    * On failure, calls {@link Inflate.onEnd} with the error code and returns false.
    *
    * Once the stream has ended (a compressed stream may end before your data
    * does), further `push` calls are no-ops and return whether the decode
    * finished successfully. The final outcome is in {@link Inflate.result},
    * {@link Inflate.err} and {@link Inflate.msg}.
    *
    * @param flush_mode 0..6 for corresponding {@link Z_NO_FLUSH}..{@link Z_TREES}
    *   flush modes. See constants. Skipped or `false` means {@link Z_NO_FLUSH},
    *   `true` means {@link Z_FINISH}.
    *
    * @example
    * ```javascript
    * push(chunk, false) // push one of data chunks
    * ...
    * push(chunk, true)  // push last chunk
    * ```
    */
    push(data, flush_mode = false) {
      const strm = this.strm;
      const chunkSize = this.options.chunkSize;
      let status;
      let _flush_mode;
      let last_avail_out;
      if (this.ended) return this.err === 0;
      if (typeof flush_mode === "number") _flush_mode = flush_mode;
      else _flush_mode = flush_mode === true ? 4 : 0;
      if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
      else strm.input = data;
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      if (!this.started) {
        this.started = true;
        this.onStart(strm);
      }
      for (; ; ) {
        if (strm.avail_out === 0) {
          strm.output = new Uint8Array(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = inflate$1(strm, _flush_mode);
        if (status === 2) {
          const dictionary = this.options.dictionary;
          if (dictionary.length) {
            status = inflateSetDictionary(strm, dictionary);
            if (status === 0) status = inflate$1(strm, _flush_mode);
            else if (status === -3) status = 2;
          }
        }
        while (strm.avail_in > 0 && status === 1 && strm.state.wrap & 2 && strm.state.flags !== 0 && strm.input[strm.next_in] !== 0) {
          inflateReset(strm);
          status = inflate$1(strm, _flush_mode);
        }
        if (status === -2 || status === -3 || status === 2 || status === -4) break;
        last_avail_out = strm.avail_out;
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === 1 || _flush_mode > 0) {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
            strm.avail_out = 0;
            strm.next_out = 0;
          }
        }
        if ((status === 0 || status === -5) && last_avail_out === 0) continue;
        if (status === 1) {
          status = inflateEnd(this.strm);
          break;
        }
        if (strm.avail_in === 0) {
          if (_flush_mode === 4) {
            status = inflateEnd(this.strm);
            if (status === 0) status = -5;
            break;
          }
          return true;
        }
      }
      this.err = status;
      this.msg = strm.msg || messages_default[status];
      this.ended = true;
      this.onEnd(status);
      return status === 0;
    }
    /**
    * Called once before the first low-level inflate call.
    *
    * Override this handler to attach low-level inflate state, for example to read
    * gzip header metadata:
    *
    * ```javascript
    * import { Inflate, GZheader, zlibInflateGetHeader } from 'pako'
    *
    * const inflator = new Inflate()
    *
    * inflator.onStart = function (strm) {
    *   this.header = new GZheader()
    *   zlibInflateGetHeader(strm, this.header)
    * }
    *
    * inflator.push(data, true)
    * console.log(inflator.header.name)
    * ```
    */
    onStart(strm) {
    }
    /**
    * By default, stores data blocks in the {@link Inflate.chunks} property and glues
    * them in {@link Inflate.onEnd}. Override this handler if you need another behaviour.
    *
    * @param chunk output data.
    */
    onData(chunk) {
      this.chunks.push(chunk);
    }
    /**
    * Called after you tell inflate that the input stream is
    * complete ({@link Z_FINISH}). By default, joins the collected {@link Inflate.chunks},
    * frees memory and fills the {@link Inflate.result} property.
    *
    * @param status inflate status. {@link Z_OK} on success, other if not.
    */
    onEnd(status) {
      if (status === 0) this.result = flattenChunks(this.chunks);
      this.chunks = [];
    }
  };
  function inflate(input2, options = {}) {
    const inflator = new Inflate(options);
    inflator.push(input2, true);
    if (inflator.err) throw new Error(inflator.msg);
    const result = inflator.result;
    return options.toText ? new TextDecoder().decode(result) : result;
  }
  function inflateRaw(input2, options = {}) {
    return inflate(input2, {
      ...options,
      raw: true
    });
  }

  // src/lib/spine/spineProject.ts
  var BONE_ANCHOR = [34, 0, 0, 0, 0, 14];
  var REGION_ANCHOR = [15, 0, 14, 30, 1, 255, 255, 255, 255];
  function getF(data, o) {
    return new DataView(data.buffer, data.byteOffset, data.byteLength).getFloat32(o, false);
  }
  function setF(data, o, v) {
    new DataView(data.buffer, data.byteOffset, data.byteLength).setFloat32(o, v, false);
  }
  function findAll(data, sig) {
    const out = [];
    outer: for (let i = 0; i + sig.length <= data.length; i++) {
      for (let k = 0; k < sig.length; k++) if (data[i + k] !== sig[k]) continue outer;
      out.push(i);
    }
    return out;
  }
  function lockBoneExtras(data, anchor, lock) {
    lock(anchor + 6);
    const from = Math.max(0, anchor - 48);
    for (let p = anchor - 5; p >= from; p--) {
      if (data[p] === 23 && data[p + 1] === 0 && data[p + 2] === 0 && data[p + 3] === 0 && data[p + 4] === 0 && p >= 5 && data[p - 5] === 12) {
        lock(p - 4);
        if (p >= 10 && data[p - 10] === 13) lock(p - 9);
        break;
      }
    }
  }
  function parseBone(data, i) {
    if (i < 5 || data[i - 5] !== 10) return null;
    let j = i + 10;
    if (j + 4 > data.length || data[j] !== 31 || data[j + 1] !== 15 || data[j + 2] !== 1 || data[j + 3] !== 0) return null;
    j += 4;
    if (data[j] !== 9) return null;
    const lengthAt = j + 1;
    j += 5;
    if (data[j] === 27 && data[j + 1] === 21 && data[j + 2] === 29 && data[j + 3] === 0) j += 4;
    else if (data[j] === 27 && data[j + 1] === 1 && data[j + 2] === 1 && data[j + 3] === 29 && data[j + 4] === 0) j += 5;
    else return null;
    if (data[j] !== 11) return null;
    const yAt = j + 1;
    j += 5;
    if (data[j] !== 1 || data[j + 1] !== 1) return null;
    j += 2;
    let name = "";
    while (j < data.length) {
      const b = data[j++];
      name += String.fromCharCode(b & 127);
      if (b & 128) break;
    }
    return { x: i - 4, y: yAt, length: lengthAt, name };
  }
  function regionOffsets(data, i) {
    if (i < 15) return null;
    if (data[i - 15] !== 12 || data[i - 10] !== 7 || data[i - 5] !== 6) return null;
    const after = i + 9;
    if (after + 14 > data.length) return null;
    if (data[after] !== 9 || data[after + 5] !== 11) return null;
    if (data[after + 10] !== 13 || data[after + 11] !== 10 || data[after + 12] !== 1 || data[after + 13] !== 1) return null;
    return { h: i - 14, y: i - 9, x: i - 4, w: after + 6 };
  }
  var TRANSLATE_HDR = [132, 1, 1, 1, 1];
  var KEY_SIG = [133, 1, 1];
  var CURVE_SENTINEL = 1325400064;
  function u32be(data, o) {
    return new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(o, false);
  }
  function isKeySig(data, o) {
    return o + 3 <= data.length && data[o] === KEY_SIG[0] && data[o + 1] === KEY_SIG[1] && data[o + 2] === KEY_SIG[2];
  }
  function scaleCurveAxis(data, base, mark, used, locked) {
    if (base + 20 > data.length) return;
    if (u32be(data, base + 16) !== 0) return;
    const sent = (i) => u32be(data, base + i * 4) === CURVE_SENTINEL;
    const take = (i) => {
      const o = base + i * 4;
      if (sent(i) || locked.has(o) || used.has(o)) return;
      mark(o);
    };
    if (sent(0) && sent(1)) take(3);
    else if (sent(2) && sent(3)) take(1);
    else {
      take(1);
      take(3);
    }
  }
  function scaleTranslateTimelines(data, mark, used, locked) {
    let pairs = 0;
    for (const i of findAll(data, TRANSLATE_HDR)) {
      const count = data[i + 5];
      if (count < 1 || count > 64 || i + 9 > data.length || !isKeySig(data, i + 6)) continue;
      const keys = [i + 6];
      let p = i + 6;
      let ok = true;
      for (let n = 1; n < count; n++) {
        if (p + 15 >= data.length) {
          ok = false;
          break;
        }
        if (data[p + 15] === 0 && isKeySig(data, p + 16)) {
          p += 16;
          keys.push(p);
          continue;
        }
        if (p + 56 < data.length && isKeySig(data, p + 56)) {
          p += 56;
          keys.push(p);
          continue;
        }
        ok = false;
        break;
      }
      if (!ok || keys.length !== count || keys[count - 1] + 15 > data.length) continue;
      for (let n = 0; n < keys.length; n++) {
        const k = keys[n];
        for (const o of [k + 7, k + 11]) {
          if (!locked.has(o) && !used.has(o)) mark(o);
        }
        pairs++;
        if (n + 1 < keys.length && keys[n + 1] - k === 56) {
          scaleCurveAxis(data, k + 16, mark, used, locked);
          scaleCurveAxis(data, k + 36, mark, used, locked);
        }
      }
    }
    return pairs;
  }
  function scaleSpineInflated(src, factor, offsetX = 0, offsetY = 0) {
    const data = new Uint8Array(src);
    const used = /* @__PURE__ */ new Set();
    const locked = /* @__PURE__ */ new Set();
    const mark = (o) => {
      if (locked.has(o)) return;
      used.add(o);
      setF(data, o, getF(data, o) * factor);
    };
    const lock = (o) => {
      if (o >= 0 && o + 4 <= data.length) locked.add(o);
    };
    let bones = 0;
    let root = null;
    for (const i of findAll(data, BONE_ANCHOR)) {
      const b = parseBone(data, i);
      if (!b) continue;
      bones++;
      if (b.name === "root") root = b;
      lockBoneExtras(data, i, lock);
      mark(b.x);
      mark(b.y);
      mark(b.length);
    }
    let regions = 0;
    const regionPts = [];
    for (const i of findAll(data, REGION_ANCHOR)) {
      const r = regionOffsets(data, i);
      if (!r) continue;
      regions++;
      regionPts.push({
        x: getF(data, r.x),
        y: getF(data, r.y),
        w: getF(data, r.w),
        h: getF(data, r.h)
      });
      mark(r.x);
      mark(r.y);
      mark(r.w);
      mark(r.h);
    }
    let meshFloats = 0;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const add2 = (x, y) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    };
    const trailers = [
      [54, 1, 2, 0],
      [31, 30, 1, 255]
    ];
    for (let i = 0; i + 8 < data.length; i++) {
      if (data[i] !== 1 || data[i + 1] !== 17 || data[i + 2] !== 1) continue;
      const n = data[i + 3];
      if (n < 2 || n > 40 || n % 2 !== 0) continue;
      const end = i + 4 + n * 4;
      if (end + 4 > data.length) continue;
      let ok = false;
      for (const trailer of trailers) {
        let match = true;
        for (let k = 0; k < 4; k++) if (data[end + k] !== trailer[k]) match = false;
        if (match) ok = true;
      }
      if (!ok) continue;
      for (let k = 0; k < n; k += 2) {
        const xo = i + 4 + k * 4;
        const yo = xo + 4;
        if (locked.has(xo) || locked.has(yo)) continue;
        add2(getF(data, xo), getF(data, yo));
        if (!used.has(xo)) {
          mark(xo);
          meshFloats++;
        }
        if (!used.has(yo)) {
          mark(yo);
          meshFloats++;
        }
      }
      i = end - 1;
    }
    const animPairs = scaleTranslateTimelines(data, mark, used, locked);
    if (root && (offsetX || offsetY)) {
      if (offsetX) setF(data, root.x, getF(data, root.x) + offsetX);
      if (offsetY) setF(data, root.y, getF(data, root.y) + offsetY);
    }
    for (const r of regionPts) {
      add2(r.x - r.w / 2, r.y - r.h / 2);
      add2(r.x + r.w / 2, r.y + r.h / 2);
    }
    if (!Number.isFinite(minX)) {
      minX = 0;
      minY = 0;
      maxX = 0;
      maxY = 0;
    }
    return {
      bytes: data,
      stats: {
        bones,
        regions,
        meshFloats,
        animPairs,
        meshSpan: { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
      }
    };
  }
  var FOOTER_LEN = 20;
  var FOOTER_MAGIC = [2, 11, 2, 11];
  function footerMagicOk(footer) {
    if (footer.length < 4) return false;
    const at = footer.length - 4;
    for (let i = 0; i < 4; i++) if (footer[at + i] !== FOOTER_MAGIC[i]) return false;
    return true;
  }
  function packedLengthOf(footer) {
    if (footer.length < 8) return 0;
    return new DataView(footer.buffer, footer.byteOffset, footer.byteLength).getUint32(4, false);
  }
  function splitSpine(raw) {
    if (raw.length >= FOOTER_LEN && footerMagicOk(raw.slice(raw.length - FOOTER_LEN))) {
      const footer2 = raw.slice(raw.length - FOOTER_LEN);
      const declared = packedLengthOf(footer2);
      const payloadEnd = declared > 0 && declared + FOOTER_LEN <= raw.length ? declared : raw.length - FOOTER_LEN;
      try {
        return { inflated: inflateRaw(raw.slice(0, payloadEnd)), footer: footer2 };
      } catch {
      }
    }
    const inflator = new Inflate({ raw: true });
    inflator.push(raw, true);
    const inflated = inflator.result;
    if (inflator.err || !(inflated instanceof Uint8Array) || inflated.length === 0) {
      return { inflated: inflateRaw(raw), footer: new Uint8Array(0) };
    }
    const consumed = inflator.strm?.total_in ?? raw.length;
    const footer = consumed > 0 && consumed < raw.length ? raw.slice(consumed) : new Uint8Array(0);
    return { inflated, footer };
  }
  function patchFooter(footer, packedLen) {
    const out = footer.length >= FOOTER_LEN && footerMagicOk(footer) ? footer.slice() : new Uint8Array(FOOTER_LEN);
    if (!footerMagicOk(out)) out.set(FOOTER_MAGIC, FOOTER_LEN - 4);
    new DataView(out.buffer, out.byteOffset, out.byteLength).setUint32(4, packedLen >>> 0, false);
    return out;
  }
  async function inflateRaw2(raw) {
    return splitSpine(raw).inflated;
  }
  async function deflateRaw2(data) {
    return deflateRaw(data, { level: 6 });
  }
  async function scaleSpineFile(raw, factor, offsetX = 0, offsetY = 0) {
    const { inflated, footer } = splitSpine(raw);
    if (factor === 1 && !offsetX && !offsetY) {
      const stats = scaleSpineInflated(inflated, 1).stats;
      return { bytes: raw, stats };
    }
    const scaled = scaleSpineInflated(inflated, factor, offsetX, offsetY);
    const packed = await deflateRaw2(scaled.bytes);
    const tail = patchFooter(footer, packed.length);
    const bytes = new Uint8Array(packed.length + tail.length);
    bytes.set(packed, 0);
    bytes.set(tail, packed.length);
    return { bytes, stats: scaled.stats };
  }
  function measureSpine(inflated) {
    return scaleSpineInflated(inflated, 1).stats;
  }

  // src/lib/spine/resizeCore.ts
  function fitFactor(box, target) {
    const m = Math.max(box.width, box.height);
    if (!Number.isFinite(m) || m < 1) return 1;
    return target / m;
  }
  function centerOffset(box, factor) {
    const cx = (box.minX + box.maxX) / 2;
    const cy = (box.minY + box.maxY) / 2;
    return { x: -cx * factor, y: -cy * factor };
  }
  function num(v, d = 0) {
    return typeof v === "number" ? v : d;
  }
  function weightedInfluences(verts) {
    const out = [];
    let i = 0;
    while (i < verts.length) {
      const bc = verts[i];
      if (!Number.isInteger(bc) || bc < 1 || bc > 32) return null;
      i++;
      if (i + bc * 4 > verts.length) return null;
      for (let k = 0; k < bc; k++) {
        const bone = verts[i];
        if (!Number.isInteger(bone) || bone < 0) return null;
        out.push({ bone, xi: i + 1, yi: i + 2 });
        i += 4;
      }
    }
    return out;
  }
  function scaleCurve(curve, sx, sy) {
    if (!curve || typeof curve === "string" || curve.length < 4) return;
    const dims = Math.floor(curve.length / 4);
    for (let d = 0; d < dims; d++) {
      const m = d === 0 ? sx : sy;
      curve[d * 4 + 1] *= m;
      curve[d * 4 + 3] *= m;
    }
  }
  function eachAtt(data, fn) {
    for (const skin of data.skins ?? []) {
      for (const [slot, atts] of Object.entries(skin.attachments ?? {})) {
        for (const att of Object.values(atts)) if (att) fn(slot, att);
      }
    }
  }
  function bakeJsonScales(data) {
    const bones = data.bones ?? [];
    const indexOf = new Map(bones.map((b, i) => [b.name, i]));
    const kids = /* @__PURE__ */ new Map();
    for (const b of bones) {
      if (!b.parent) continue;
      const list2 = kids.get(b.parent) ?? [];
      list2.push(b);
      kids.set(b.parent, list2);
    }
    const slotBone = new Map((data.slots ?? []).map((s) => [s.name, s.bone || "root"]));
    const orig = new Map(bones.map((b) => [b.name, { sx: b.scaleX ?? 1, sy: b.scaleY ?? 1 }]));
    const order = [];
    const seen = /* @__PURE__ */ new Set();
    const walk = (b) => {
      if (seen.has(b.name)) return;
      seen.add(b.name);
      if (b.parent) {
        const p = bones.find((x) => x.name === b.parent);
        if (p) walk(p);
      }
      order.push(b);
    };
    for (const b of bones) walk(b);
    const touchVerts = (att, boneName, bi, sx, sy, onSlot) => {
      const verts = att.vertices;
      if (!verts) return;
      const weighted = att.uvs ? verts.length !== att.uvs.length : att.type === "mesh" ? false : null;
      if (weighted === false || weighted == null && !weightedInfluences(verts)) {
        if (!onSlot) return;
        for (let i = 0; i + 1 < verts.length; i += 2) {
          verts[i] *= sx;
          verts[i + 1] *= sy;
        }
        return;
      }
      const inf = weightedInfluences(verts);
      if (!inf) {
        if (!onSlot) return;
        for (let i = 0; i + 1 < verts.length; i += 2) {
          verts[i] *= sx;
          verts[i + 1] *= sy;
        }
        return;
      }
      for (const p of inf) {
        if (p.bone !== bi) continue;
        verts[p.xi] *= sx;
        verts[p.yi] *= sy;
      }
      void boneName;
    };
    for (const b of order) {
      const sx = b.scaleX ?? 1;
      const sy = b.scaleY ?? 1;
      if (b.length != null) b.length *= sx;
      const bi = indexOf.get(b.name) ?? -1;
      eachAtt(data, (slot, att) => {
        const onSlot = slotBone.get(slot) === b.name;
        if (onSlot && (att.type == null || att.type === "region" || att.type === "point")) {
          if (att.x != null) att.x *= sx;
          if (att.y != null) att.y *= sy;
          if (att.width != null) att.width *= sx;
          if (att.height != null) att.height *= sy;
        }
        touchVerts(att, b.name, bi, sx, sy, onSlot);
      });
      for (const c of kids.get(b.name) ?? []) {
        if ((c.inherit ?? "normal") !== "normal") continue;
        if (c.x != null) c.x *= sx;
        if (c.y != null) c.y *= sy;
        c.scaleX = (c.scaleX ?? 1) * sx;
        c.scaleY = (c.scaleY ?? 1) * sy;
        if (sx !== 1 || sy !== 1) {
          for (const anim of Object.values(data.animations ?? {})) {
            const tl = anim.bones?.[c.name];
            if (!tl) continue;
            for (const k of tl.translate ?? []) {
              if (k.x != null) k.x *= sx;
              if (k.y != null) k.y *= sy;
              scaleCurve(k.curve, sx, sy);
            }
            for (const k of tl.translatex ?? []) {
              if (k.x != null) k.x *= sx;
              else if (k.value != null) k.value *= sx;
              scaleCurve(k.curve, sx, sx);
            }
            for (const k of tl.translatey ?? []) {
              if (k.y != null) k.y *= sy;
              else if (k.value != null) k.value *= sy;
              scaleCurve(k.curve, sy, sy);
            }
          }
        }
      }
      const o = orig.get(b.name);
      if (o.sx !== 1 || o.sy !== 1) {
        for (const anim of Object.values(data.animations ?? {})) {
          const tl = anim.bones?.[b.name];
          for (const k of tl?.scale ?? []) {
            if (k.x != null) k.x /= o.sx;
            if (k.y != null) k.y /= o.sy;
            scaleCurve(k.curve, 1 / o.sx, 1 / o.sy);
          }
        }
      }
      b.scaleX = 1;
      b.scaleY = 1;
    }
  }
  function jsonWorld(bones) {
    const byName = new Map(bones.map((b) => [b.name, b]));
    const world = /* @__PURE__ */ new Map();
    const resolve = (name) => {
      const hit = world.get(name);
      if (hit) return hit;
      const b = byName.get(name);
      const parent = b?.parent ? resolve(b.parent) : { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };
      if (!b) {
        world.set(name, parent);
        return parent;
      }
      const rot = num(b.rotation) * Math.PI / 180;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const lsx = b.scaleX ?? 1;
      const lsy = b.scaleY ?? 1;
      const la = cos * lsx;
      const lb = sin * lsx;
      const lc = -sin * lsy;
      const ld = cos * lsy;
      const w = {
        x: parent.x + parent.a * num(b.x) + parent.b * num(b.y),
        y: parent.y + parent.c * num(b.x) + parent.d * num(b.y),
        a: parent.a * la + parent.b * lc,
        b: parent.a * lb + parent.b * ld,
        c: parent.c * la + parent.d * lc,
        d: parent.c * lb + parent.d * ld
      };
      world.set(name, w);
      return w;
    };
    for (const b of bones) resolve(b.name);
    return world;
  }
  function jsonAABB(data) {
    const world = jsonWorld(data.bones ?? []);
    const slotBone = new Map((data.slots ?? []).map((s) => [s.name, s.bone || "root"]));
    const index = new Map((data.bones ?? []).map((b, i) => [i, b.name]));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const add2 = (x, y) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    };
    const xform = (wt, x, y) => add2(wt.x + wt.a * x + wt.b * y, wt.y + wt.c * x + wt.d * y);
    eachAtt(data, (slot, att) => {
      const wt = world.get(slotBone.get(slot) || "root") ?? { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };
      if (att.width != null && att.height != null && att.type !== "mesh") {
        const w = att.width * (att.scaleX ?? 1);
        const h = att.height * (att.scaleY ?? 1);
        const rot = num(att.rotation) * Math.PI / 180;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        const hw = w / 2;
        const hh = h / 2;
        for (const [cx, cy] of [
          [-hw, -hh],
          [hw, -hh],
          [hw, hh],
          [-hw, hh]
        ]) {
          xform(wt, cx * cos - cy * sin + num(att.x), cx * sin + cy * cos + num(att.y));
        }
      }
      const verts = att.vertices;
      if (!verts) return;
      const inf = att.uvs && verts.length !== att.uvs.length ? weightedInfluences(verts) : null;
      if (inf) {
        let i = 0;
        while (i < verts.length) {
          const bc = verts[i++];
          let wx = 0;
          let wy = 0;
          for (let k = 0; k < bc; k++) {
            const bone = verts[i++];
            const x = verts[i++];
            const y = verts[i++];
            const w = verts[i++];
            const bw = world.get(index.get(bone) || "") ?? wt;
            wx += (bw.x + bw.a * x + bw.b * y) * w;
            wy += (bw.y + bw.c * x + bw.d * y) * w;
          }
          add2(wx, wy);
        }
      } else {
        for (let i = 0; i + 1 < verts.length; i += 2) xform(wt, verts[i], verts[i + 1]);
      }
    });
    if (!Number.isFinite(minX)) {
      for (const w of world.values()) add2(w.x, w.y);
    }
    if (!Number.isFinite(minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }
  function scaleDeformTree(node, s) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const key of node) {
        if (!key || typeof key !== "object") continue;
        const rec = key;
        if (Array.isArray(rec.vertices)) for (let i = 0; i < rec.vertices.length; i++) rec.vertices[i] *= s;
      }
      return;
    }
    for (const value of Object.values(node)) scaleDeformTree(value, s);
  }
  function mulNum(obj, key, s) {
    if (typeof obj[key] === "number") obj[key] = obj[key] * s;
  }
  function scaleTransformBody(c, s) {
    mulNum(c, "x", s);
    mulNum(c, "y", s);
    const props = c.properties;
    if (!props || typeof props !== "object" || Array.isArray(props)) return;
    for (const [fromName, fromVal] of Object.entries(props)) {
      if (!fromVal || typeof fromVal !== "object" || Array.isArray(fromVal)) continue;
      const from = fromVal;
      const fromS = fromName === "x" || fromName === "y" ? s : 1;
      if (fromS !== 1) mulNum(from, "offset", fromS);
      const to = from.to;
      if (!to || typeof to !== "object" || Array.isArray(to)) continue;
      for (const [toName, toVal] of Object.entries(to)) {
        if (!toVal || typeof toVal !== "object" || Array.isArray(toVal)) continue;
        const rec = toVal;
        const toS = toName === "x" || toName === "y" ? s : 1;
        if (toS !== 1) {
          mulNum(rec, "offset", toS);
          mulNum(rec, "max", toS);
        }
        const ratio = fromS === 0 ? 1 : toS / fromS;
        if (ratio !== 1 && typeof rec.scale === "number") rec.scale = rec.scale * ratio;
      }
    }
  }
  function scalePhysicsBody(c, s) {
    mulNum(c, "limit", s);
    mulNum(c, "wind", s);
    mulNum(c, "gravity", s);
  }
  function scaleSliderBody(c, s) {
    if (c.property !== "x" && c.property !== "y") return;
    mulNum(c, "from", s);
    if (typeof c.scale === "number" && s !== 0) c.scale = c.scale / s;
  }
  function scaleConstraintSetup(data, s) {
    for (const raw of data.constraints ?? []) {
      const c = raw;
      if (typeof c.softness === "number") c.softness = c.softness * s;
      if (c.type === "transform") scaleTransformBody(c, s);
      else if (c.type === "physics") scalePhysicsBody(c, s);
      else if (c.type === "slider") scaleSliderBody(c, s);
      else if (c.type === "path" || c.type == null) {
        const positionMode = c.positionMode;
        const spacingMode = c.spacingMode;
        if (typeof c.position === "number" && positionMode === "fixed") c.position = c.position * s;
        if (typeof c.spacing === "number" && (spacingMode === "length" || spacingMode === "fixed" || spacingMode == null) && c.type === "path") {
          c.spacing = c.spacing * s;
        }
      }
    }
    for (const c of data.ik ?? []) {
      if (typeof c.softness === "number") c.softness *= s;
    }
    const legacy = data;
    for (const c of legacy.physics ?? []) scalePhysicsBody(c, s);
  }
  function scaleJson(data, factor, offsetX = 0, offsetY = 0, bonesToScale) {
    const s = factor;

    // Determine which bones to scale
    const scaleAll = !bonesToScale || bonesToScale.size === 0;
    const shouldScale = new Set();
    
    if (scaleAll) {
      // Scale all bones
      const dataBones = data.bones ?? [];
      for (const b of dataBones) {
        shouldScale.add(b.name);
      }
    } else {
      // Scale selected bones and their descendants
      for (const name of bonesToScale) {
        shouldScale.add(name);
        // Add all children
        const stack = [];
        // We'll populate this during actual scaling
      }
    }
    const animNames = Object.keys(data.animations ?? {});
    for (const b of data.bones ?? []) {
      if (!scaleAll && !shouldScale.has(b.name)) continue;

      if (b.x != null) b.x *= s;
      if (b.y != null) b.y *= s;
      if (b.length != null) b.length *= s;
    }
    const root = (data.bones ?? []).find((b) => !b.parent) ?? data.bones?.[0];
    if (root && (offsetX || offsetY)) {
      root.x = num(root.x) + offsetX;
      root.y = num(root.y) + offsetY;
    }
    eachAtt(data, function(_slot, att) {
      if (!scaleAll && !shouldScale.has(_slot)) return;
      if (att.x != null) att.x *= s;
      if (att.y != null) att.y *= s;
      if (att.width != null) att.width *= s;
      if (att.height != null) att.height *= s;
      const verts = att.vertices;
      if (verts) {
        const inf = att.uvs && verts.length !== att.uvs.length ? weightedInfluences(verts) : null;
        if (inf) {
          for (const p of inf) {
            verts[p.xi] *= s;
            verts[p.yi] *= s;
          }
        } else {
          for (let i = 0; i < verts.length; i++) verts[i] *= s;
        }
      }
      if (att.lengths) for (let i = 0; i < att.lengths.length; i++) att.lengths[i] *= s;
    });
    for (const anim of Object.values(data.animations ?? {})) {
      for (const tl of Object.values(anim.bones ?? {})) {
        for (const k of tl.translate ?? []) {
          if (k.x != null) k.x *= s;
          if (k.y != null) k.y *= s;
          scaleCurve(k.curve, s, s);
        }
        for (const k of tl.translatex ?? []) {
          if (k.x != null) k.x *= s;
          else if (k.value != null) k.value *= s;
          scaleCurve(k.curve, s, s);
        }
        for (const k of tl.translatey ?? []) {
          if (k.y != null) k.y *= s;
          else if (k.value != null) k.value *= s;
          scaleCurve(k.curve, s, s);
        }
      }
      const attachments = anim.attachments ?? {};
      for (const slot of Object.values(attachments)) {
        if (!slot || typeof slot !== "object") continue;
        for (const tl of Object.values(slot)) {
          if (Array.isArray(tl)) {
            for (const k of tl) if (k?.vertices) for (let i = 0; i < k.vertices.length; i++) k.vertices[i] *= s;
          } else if (tl && Array.isArray(tl.deform)) {
            for (const k of tl.deform) if (k.vertices) for (let i = 0; i < k.vertices.length; i++) k.vertices[i] *= s;
          }
        }
      }
      scaleDeformTree(anim.deform, s);
      for (const keys of Object.values(anim.ik ?? {})) {
        if (!Array.isArray(keys)) continue;
        for (const k of keys) {
          if (typeof k.softness === "number") k.softness *= s;
          scaleCurve(k.curve, 1, s);
        }
      }
    }
    scaleConstraintSetup(data, s);
    for (const c of data.transform ?? []) {
      if (c.x != null) c.x *= s;
      if (c.y != null) c.y *= s;
    }
    for (const c of data.path ?? []) {
      if (c.position != null && c.positionMode === "fixed") c.position *= s;
      if (c.spacing != null && (c.spacingMode === "length" || c.spacingMode === "fixed" || c.spacingMode == null)) c.spacing *= s;
    }
    const sk = data.skeleton;
    if (sk) {
      for (const key of ["width", "height", "x", "y"]) {
        if (typeof sk[key] === "number") sk[key] = sk[key] * s;
      }
    }
    const now = data.animations ?? {};
    if (animNames.length && animNames.some((name) => !now[name] || typeof now[name] !== "object")) {
      throw new Error("animations were dropped");
    }
  }

  function scaleAtlas(text, factor) {
    if (!text || factor === 1) return text;
    return text.split(/\r?\n/).map((line2) => {
      const m = line2.match(/^(\s*)(bounds|offsets|split|pad|offset|orig|size|xy):(\s*)(.*)$/i);
      if (!m) return line2;
      const key = m[2].toLowerCase();
      const nums = m[4].split(",").map((x) => x.trim());
      const count = key === "bounds" || key === "offsets" || key === "split" || key === "pad" ? 4 : 2;
      if (nums.length < count) return line2;
      for (let i = 0; i < count; i++) if (nums[i] === "" || Number.isNaN(+nums[i])) return line2;
      const scaled = nums.slice(0, count).map((n) => String(Math.round(+n * factor)));
      const tail = nums.slice(count);
      return m[1] + m[2] + ":" + m[3] + scaled.join(",") + (tail.length ? "," + tail.join(",") : "");
    }).join("\n");
  }

  // src/lib/spine/resizeProject.ts
  var IMAGE_EXT = /* @__PURE__ */ new Set([".png", ".jpg", ".jpeg", ".webp"]);
  function baseName(path) {
    const parts = path.split("/");
    return parts[parts.length - 1] || path;
  }
  function kindOf(path) {
    const name = baseName(path).toLowerCase();
    if (name.endsWith(".atlas") || name.endsWith(".atlas.txt")) return "atlas";
    if (name.endsWith(".skel") || name.endsWith(".skel.bytes")) return "skel";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".spine")) return "spine";
    if (IMAGE_EXT.has(extOf(path))) return "image";
    return "other";
  }
  function extOf(path) {
    const name = baseName(path).toLowerCase();
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? name.slice(dot) : "";
  }
  function junkPath(path) {
    if (path.includes("__MACOSX")) return true;
    const base = baseName(path);
    return base === ".DS_Store" || base.startsWith("._");
  }
  function isZip(data) {
    return data.length > 3 && data[0] === 80 && data[1] === 75;
  }
  function decodeText(data) {
    return new TextDecoder().decode(data);
  }
  function encodeText(text) {
    return new TextEncoder().encode(text);
  }
  async function walkZip(data, prefix, out) {
    const zip = await import_jszip.default.loadAsync(data);
    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir || junkPath(path)) continue;
      const buf = new Uint8Array(await entry.async("uint8array"));
      const full = prefix + path;
      if (extOf(full) === ".zip" || isZip(buf)) {
        const folder = full.replace(/\.zip$/i, "");
        await walkZip(buf, folder + "/", out);
      } else {
        out.push({ path: full, data: buf });
      }
    }
  }
  async function collectFiles(list2) {
    const out = [];
    for (const file of list2) {
      const data = new Uint8Array(await file.arrayBuffer());
      if (extOf(file.name) === ".zip" || isZip(data)) await walkZip(data, "", out);
      else out.push({ path: file.name, data });
    }
    return out;
  }
  async function zipEntries(entries) {
    const zip = new import_jszip.default();
    for (const entry of entries) zip.file(entry.path, entry.data);
    return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  }
  function parseJson(data) {
    try {
      const value = JSON.parse(decodeText(data));
      if (!value || typeof value !== "object") return null;
      const hasBones = Array.isArray(value.bones);
      const hasAnims = !!value.animations && typeof value.animations === "object" && !Array.isArray(value.animations);
      if (!hasBones && !hasAnims) return null;
      if (!hasBones) value.bones = [];
      loadSkeletonForTree(value, baseName(entry.path));
      return value;
    } catch {
      return null;
    }
  }
  function emptyBox() {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  function larger(a, b) {
    return Math.max(a.width, a.height) >= Math.max(b.width, b.height) ? a : b;
  }
  async function resizeRaster(data, path, factor) {
    try {
      if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-8) return data;
      if (typeof createImageBitmap !== "function" || typeof document === "undefined") return data;
      const ext = extOf(path);
      const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : "image/png";
      const bitmap = await createImageBitmap(new Blob([data.slice()]));
      const width = Math.max(1, Math.round(bitmap.width * factor));
      const height = Math.max(1, Math.round(bitmap.height * factor));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return data;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
      if (!blob) return data;
      return new Uint8Array(await blob.arrayBuffer());
    } catch {
      return data;
    }
  }
  function trimNum(n) {
    return String(Math.round(n * 1e3) / 1e3);
  }
  function factorFor(box, opts) {
    const target = Math.max(16, Math.min(8192, Math.round(opts.target) || 300));
    if (opts.mode === "times") {
      const raw = Number(opts.times);
      const times2 = Math.max(0.01, Math.min(100, Number.isFinite(raw) ? raw : 1));
      return { factor: times2, asked: `\xD7${trimNum(times2)}` };
    }
    if (opts.mode === "percent") {
      const raw = Number(opts.percent);
      const percent2 = Math.max(-99, Math.min(9900, Math.round(Number.isFinite(raw) ? raw : 0)));
      const factor = Math.max(0.01, Math.min(100, 1 + percent2 / 100));
      const sign = percent2 > 0 ? "+" : "";
      return { factor, asked: `${sign}${percent2}%` };
    }
    return { factor: fitFactor(box, target), asked: String(target) };
  }
  async function resizeEntries(entries, opts) {
    const jsons = [];
    const skels = [];
    const spines = [];
    const atlases = [];
    const images = [];
    const rest = [];
    for (const entry of entries) {
      const kind2 = kindOf(entry.path);
      if (kind2 === "json") {
        const data = parseJson(entry.data);
        if (!data) {
          rest.push(entry);
          continue;
        }
        if (opts.bake) bakeJsonScales(data);
        jsons.push({ path: entry.path, data, box: jsonAABB(data) });
      } else if (kind2 === "skel") {
        const sk = readSkel(entry.data);
        if (opts.bake) bakeSkelScales(sk);
        skels.push({ path: entry.path, sk, box: skelWorldAABB(sk) });
      } else if (kind2 === "spine") spines.push(entry);
      else if (kind2 === "atlas") atlases.push(entry);
      else if (kind2 === "image") images.push(entry);
      else rest.push(entry);
    }
    let box = emptyBox();
    for (const job of skels) box = larger(box, job.box);
    for (const job of jsons) box = larger(box, job.box);
    let approx = false;
    if (box.width < 1 && box.height < 1 && spines.length) {
      approx = true;
      for (const entry of spines) {
        const inflated = await inflateRaw2(entry.data);
        const span = measureSpine(inflated).meshSpan;
        box = larger(box, {
          minX: span.minX,
          minY: span.minY,
          maxX: span.maxX,
          maxY: span.maxY,
          width: span.width,
          height: span.height
        });
      }
    }
    if (box.width < 1 && box.height < 1 && !jsons.length && !skels.length && !spines.length) {
      throw new Error("No .json, .skel or .spine");
    }
    const { factor, asked } = factorFor(box, opts);
    const out = [];
    for (const job of jsons) {
      const off = opts.center ? centerOffset(job.box, factor) : { x: 0, y: 0 };
      scaleJson(job.data, factor, off.x, off.y);
      out.push({ path: job.path, data: encodeText(JSON.stringify(job.data)) });
    }
    for (const job of skels) {
      const off = opts.center ? centerOffset(job.box, factor) : { x: 0, y: 0 };
      scaleSkel(job.sk, factor, off.x, off.y);
      const bytes = writeSkel(job.sk, 1);
      readSkel(bytes);
      out.push({ path: job.path, data: bytes });
    }
    const shared = opts.center ? centerOffset(box, factor) : { x: 0, y: 0 };
    let spineBones = 0;
    let spineKeys = 0;
    for (const entry of spines) {
      const scaled = await scaleSpineFile(entry.data, factor, shared.x, shared.y);
      spineBones = Math.max(spineBones, scaled.stats.bones);
      spineKeys += scaled.stats.animPairs;
      out.push({ path: entry.path, data: scaled.bytes });
    }
    for (const entry of atlases) {
      out.push({ path: entry.path, data: encodeText(scaleAtlas(decodeText(entry.data), factor)) });
    }
    for (const entry of images) {
      out.push({ path: entry.path, data: await resizeRaster(entry.data, entry.path, factor) });
    }
    out.push(...rest);
    const w = Math.round(box.width);
    const h = Math.round(box.height);
    const kinds = [];
    if (jsons.length) kinds.push("json");
    if (skels.length) kinds.push("skel");
    if (spines.length) kinds.push("spine");
    const kind = kinds.join("+") || "spine";
    const bones = skels[0]?.sk.bones.length ?? jsons[0]?.data.bones.length ?? spineBones;
    const jsonAnims = jsons.reduce((n, job) => n + Object.keys(job.data.animations ?? {}).length, 0);
    const skelAnims = skels.reduce((n, job) => n + (job.sk.animations?.length ?? 0), 0);
    const animBits = [];
    if (jsons.length && !skels.length) animBits.push(`${jsonAnims} anim`);
    else if (skels.length && !jsons.length) animBits.push(`${skelAnims} anim`);
    else {
      if (jsons.length) animBits.push(`${jsonAnims} json`);
      if (skels.length) animBits.push(`${skelAnims} skel`);
    }
    if (spines.length) animBits.push(`${spineKeys} translate`);
    const animText = animBits.join("  ") || "0 anim";
    const line2 = `${kind}  ${w}\xD7${h}${approx ? "~" : ""}  \xD7${factor.toFixed(3)}  ${bones} bones  ${animText}  ${asked}`;
    return { entries: out, factor, line: line2 };
  }

  // Tree-based bone selection state
let skeletonData = null;  // The loaded skeleton JSON
let boneHierarchy = [];   // Flattened bone tree data
let boneChildrenMap = new Map();  // bone -> [children]
let selectedBones = new Set();    // Currently selected bone names
let currentSkeletonName = null;   // Name of the current skeleton

// DOM elements for tree UI
let treeContainer = null;
let treePlaceholder = null;
let boneListContainer = null;

// Initialize tree UI when DOM is ready
function initTreeUI() {
  treeContainer = document.getElementById('tree');
  treePlaceholder = document.getElementById('tree-placeholder');
  
  // Create container for bone list
  boneListContainer = document.createElement('div');
  boneListContainer.style.display = 'none';
  
  // Show placeholder initially
  if (treePlaceholder) {
    treePlaceholder.style.display = 'block';
    treeContainer.appendChild(boneListContainer);
  }
}

// Parse skeleton data and build hierarchy for tree display
function loadSkeletonForTree(jsonData, name) {
  skeletonData = jsonData;
  currentSkeletonName = name;
  
  if (!jsonData.bones || !Array.isArray(jsonData.bones)) {
    if (treePlaceholder) treePlaceholder.textContent = 'No bones found in skeleton';
    return;
  }
  
  // Build bone hierarchy
  const bonesByName = new Map();
  for (const bone of jsonData.bones) {
    bonesByName.set(bone.name, bone);
  }
  
  // Build children map
  for (const bone of jsonData.bones) {
    if (bone.parent) {
      if (!boneChildrenMap.has(bone.parent)) {
        boneChildrenMap.set(bone.parent, []);
      }
      boneChildrenMap.get(bone.parent).push(bone.name);
    }
  }
  
  // Find root bones (no parent or parent not in skeleton)
  const roots = [];
  for (const bone of jsonData.bones) {
    if (!bone.parent || !bonesByName.has(bone.parent)) {
      roots.push(bone.name);
    }
  }
  
  // Build flattened hierarchy for display
  boneHierarchy = [];
  function visit(boneName, depth) {
    const bone = bonesByName.get(boneName);
    if (!bone) return;
    
    boneHierarchy.push({
      name: boneName,
      displayName: bone.name,
      depth: depth,
      hasChildren: boneChildrenMap.has(bone.name),
      isControl: bone.name.includes('-control') || bone.icon === 'ik' || bone.name === 'root',
      color: bone.color || '#ffffff'
    });
    
    const children = boneChildrenMap.get(bone.name) || [];
    for (const child of children) {
      visit(child, depth + 1);
    }
  }
  
  for (const root of roots) {
    visit(root, 0);
  }
  
  // Update UI
  updateBoneTree();
}

// Update the bone tree display
function updateBoneTree() {
  if (!treeContainer || !treePlaceholder || !boneListContainer) return;
  
  if (!boneHierarchy.length) {
    if (treePlaceholder) treePlaceholder.textContent = 'No bone data available';
    treePlaceholder.style.display = 'block';
    boneListContainer.style.display = 'none';
    return;
  }
  
  treePlaceholder.style.display = 'none';
  boneListContainer.style.display = 'block';
  boneListContainer.innerHTML = '';
  
  // Create tree container
  const treeWrapper = document.createElement('div');
  treeWrapper.style.maxHeight = '400px';
  treeWrapper.style.overflowY = 'auto';
  treeWrapper.style.border = '1px solid #2a2a2a';
  treeWrapper.style.borderRadius = '4px';
  treeWrapper.style.padding = '8px';
  treeWrapper.style.backgroundColor = '#1a1a1e';
  
  // Add header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '8px';
  header.style.fontSize = '0.8rem';
  header.style.color = '#8b8b96';
  header.innerHTML = '<span>Bones (' + boneHierarchy.length + ')</span>' +
    '<div>' +
    '<button id="selectAllBtn" class="chip" style="font-size:0.75rem;padding:4px 8px;margin-right:4px">Select all</button>' +
    '<button id="clearSelBtn" class="chip" style="font-size:0.75rem;padding:4px 8px">Clear</button>' +
    '</div>';
  
  // Add tree items
  const treeItems = document.createElement('div');
  treeItems.style.display = 'flex';
  treeItems.style.flexDirection = 'column';
  treeItems.style.gap = '2px';
  
  for (const node of boneHierarchy) {
    const indent = '  '.repeat(node.depth);
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.padding = '4px 8px';
    item.style.borderRadius = '2px';
    item.style.cursor = 'pointer';
    item.style.userSelect = 'none';
    
    if (selectedBones.has(node.name)) {
      item.style.backgroundColor = '#2a2742';
    }
    
    item.innerHTML = '<input type="checkbox" class="bone-checkbox" data-bone="' + node.name + '" ' + (selectedBones.has(node.name) ? 'checked' : '') + ' style="margin-right:8px;width:16px;height:16px;" />' +
      '<span>' + indent + node.displayName + '</span>';
    
    item.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') return;
      const checkbox = item.querySelector('.bone-checkbox');
      checkbox.checked = !checkbox.checked;
      toggleBoneSelection(checkbox.dataset.bone, checkbox.checked);
    });
    
    treeItems.appendChild(item);
  }
  
  treeWrapper.appendChild(header);
  treeWrapper.appendChild(treeItems);
  boneListContainer.appendChild(treeWrapper);
  
  // Add event listeners for buttons
  const selectAllBtn = document.getElementById('selectAllBtn');
  const clearSelBtn = document.getElementById('clearSelBtn');
  
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      for (const node of boneHierarchy) {
        if (!node.isControl) {
          toggleBoneSelection(node.name, true);
        }
      }
    });
  }
  
  if (clearSelBtn) {
    clearSelBtn.addEventListener('click', () => {
      selectedBones.clear();
      updateBoneTree();
    });
  }
}

// Toggle bone selection (and descendants)
function toggleBoneSelection(boneName, selected) {
  if (selected) {
    selectedBones.add(boneName);
    // Add all descendants
    const stack = [boneName];
    while (stack.length > 0) {
      const current = stack.pop();
      const children = boneChildrenMap.get(current) || [];
      for (const child of children) {
        if (!selectedBones.has(child)) {
          selectedBones.add(child);
          stack.push(child);
        }
      }
    }
  } else {
    selectedBones.delete(boneName);
    // Remove all descendants when deselecting parent
    const stack = [boneName];
    while (stack.length > 0) {
      const current = stack.pop();
      const children = boneChildrenMap.get(current) || [];
      for (const child of children) {
        if (selectedBones.has(child)) {
          selectedBones.delete(child);
          stack.push(child);
        }
      }
    }
  }
  updateBoneTree();
}

// Get which bones should be scaled based on selection
function getBonesToScale() {
  if (selectedBones.size === 0) {
    // No selection - scale all bones
    return null;
  }
  return selectedBones;
}

// Expose for debugging
window.toggleBoneSelection = toggleBoneSelection;
window.getBonesToScale = getBonesToScale;
window.selectedBones = selectedBones;
window.boneHierarchy = boneHierarchy;

// gh/entry.ts
  var drop = document.getElementById("drop");
  var input = document.getElementById("file");
  var list = document.getElementById("list");
  var go = document.getElementById("go");
  var line = document.getElementById("line");
  var size = document.getElementById("size");
  var times = document.getElementById("times");
  var percent = document.getElementById("percent");
  var bake = document.getElementById("bake");
  var center = document.getElementById("center");
  var files = [];
  var busy = false;
  var zipUrl = "";
  function revokeZip() {
    if (!zipUrl) return;
    URL.revokeObjectURL(zipUrl);
    zipUrl = "";
  }
  function paint() {
  if (!treeContainer) initTreeUI();
    list.replaceChildren();
    for (const file of files) {
      const row = document.createElement("span");
      row.textContent = file.name;
      list.appendChild(row);
    }
    go.disabled = !files.length || busy;
    if (!files.length && !busy) line.textContent = ".json Import Data \xB7 .spine Open";
  }
  function fileKey(file) {
    return file.name + "\0" + file.size + "\0" + file.lastModified;
  }
  function add(batch) {
    const seen = new Set(files.map(fileKey));
    let added = 0;
    for (const file of batch) {
      const key = fileKey(file);
      if (seen.has(key)) continue;
      seen.add(key);
      files.push(file);
      added++;
    }
    if (!added) return;
    revokeZip();
    line.textContent = `${files.length} files`;
    paint();
  }
  var dragDepth = 0;
  var ignoreClick = false;
  drop.addEventListener("click", () => {
    if (ignoreClick) return;
    input.click();
  });
  drop.addEventListener("dragenter", (event) => {
    event.preventDefault();
    dragDepth++;
    drop.classList.add("hot");
  });
  drop.addEventListener("dragover", (event) => {
    event.preventDefault();
    drop.classList.add("hot");
  });
  drop.addEventListener("dragleave", () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) drop.classList.remove("hot");
  });
  drop.addEventListener("drop", (event) => {
    event.preventDefault();
    dragDepth = 0;
    drop.classList.remove("hot");
    ignoreClick = true;
    setTimeout(() => {
      ignoreClick = false;
    }, 400);
    if (event.dataTransfer?.files?.length) add(event.dataTransfer.files);
  });
  window.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  window.addEventListener("drop", (event) => {
    event.preventDefault();
    dragDepth = 0;
    drop.classList.remove("hot");
    const dropped = event.dataTransfer?.files;
    if (dropped?.length) add(dropped);
  });
  input.addEventListener("change", () => {
    if (input.files?.length) add(input.files);
    input.value = "";
  });
  for (const button of [bake, center]) {
    button.addEventListener("click", () => {
      const on = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  for (const field of [size, times, percent]) {
    field.addEventListener("focus", () => {
      const radio = field.parentElement?.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  }
  function scaleMode() {
    const picked = document.querySelector('input[name="scale-mode"]:checked');
    if (picked?.value === "times" || picked?.value === "percent") return picked.value;
    return "side";
  }
  go.addEventListener("click", async () => {
    if (!files.length || busy) return;
    busy = true;
    paint();
    revokeZip();
    line.textContent = "\u2026";
    try {
      const entries = await collectFiles(files);
      const result = await resizeEntries(entries, {
        target: Number(size.value) || 300,
        times: Number(times.value),
        percent: Number(percent.value),
        mode: scaleMode(),
        bonesToScale: getBonesToScale(),
        bake: bake.getAttribute("aria-pressed") === "true",
        center: center.getAttribute("aria-pressed") === "true"
      });
      const blob = await zipEntries(result.entries);
      revokeZip();
      const url = URL.createObjectURL(blob);
      zipUrl = url;
      const a = document.createElement("a");
      a.href = url;
      a.download = "resized.zip";
      a.textContent = "resized.zip";
      line.replaceChildren(document.createTextNode(result.line + "  "), a);
      a.click();
    } catch (error) {
      line.textContent = error instanceof Error ? error.message : "failed";
    } finally {
      busy = false;
      paint();
    }
  });
  paint();
})();
/*! Bundled license information:

jszip/dist/jszip.min.js:
  (*!
  
  JSZip v3.10.2 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>
  
  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
  
  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/main/LICENSE
  *)
*/
