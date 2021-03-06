// Copyright 2011 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var setter_value = 0;

__proto__.__defineSetter__("a", function(v) { setter_value = v; });
eval("var a = 1");
assertEquals(1, setter_value);
assertFalse(this.hasOwnProperty("a"));

eval("with({}) { eval('var a = 2') }");
assertEquals(2, setter_value);
assertFalse(this.hasOwnProperty("a"));

// Function declarations are treated specially to match Safari. We do
// not call setters for them.
eval("function a() {}");
assertTrue(this.hasOwnProperty("a"));

__proto__.__defineSetter__("b", function(v) { assertUnreachable(); });
var exception = false;
try {
  eval("const b = 23");
} catch(e) {
  exception = true;
  assertTrue(/TypeError/.test(e));
}
assertFalse(exception);

exception = false;
try {
  eval("with({}) { eval('const b = 23') }");
} catch(e) {
  exception = true;
  assertTrue(/TypeError/.test(e));
}
assertTrue(exception);

__proto__.__defineSetter__("c", function(v) { throw 42; });
exception = false;
try {
  eval("var c = 1");
} catch(e) {
  exception = true;
  assertEquals(42, e);
  assertFalse(this.hasOwnProperty("c"));
}
assertTrue(exception);
