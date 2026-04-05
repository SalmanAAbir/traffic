(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/user-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "generateUserId",
    ()=>generateUserId,
    "getSessionPhone",
    ()=>getSessionPhone,
    "getUserByPhone",
    ()=>getUserByPhone,
    "notifyUserListeners",
    ()=>notifyUserListeners,
    "saveUser",
    ()=>saveUser,
    "setSessionPhone",
    ()=>setSessionPhone
]);
const USERS_KEY = "dt_users_by_phone";
const SESSION_KEY = "dt_session_phone";
function readUsers() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch  {
        return {};
    }
}
function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function notifyUserListeners() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.dispatchEvent(new Event("dt-user-change"));
}
function getSessionPhone() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem(SESSION_KEY);
}
function setSessionPhone(phone) {
    if (phone === null) localStorage.removeItem(SESSION_KEY);
    else localStorage.setItem(SESSION_KEY, phone);
    notifyUserListeners();
}
function getUserByPhone(phone) {
    const users = readUsers();
    return users[phone] ?? null;
}
function saveUser(user) {
    const users = readUsers();
    users[user.phone] = user;
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, user.phone);
    notifyUserListeners();
}
function clearSession() {
    setSessionPhone(null);
}
function generateUserId() {
    const part = ()=>Math.random().toString(36).slice(2, 6).toUpperCase();
    return `DT-${part()}-${part()}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/user-storage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function subscribe(onChange) {
    window.addEventListener("dt-user-change", onChange);
    return ()=>window.removeEventListener("dt-user-change", onChange);
}
/** `getUserByPhone` parses JSON each call (new object reference). useSyncExternalStore requires a stable snapshot when data is unchanged. */ let cachedUser = null;
let cachedUserKey = "";
function getUserSnapshot() {
    const phone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSessionPhone"])();
    const user = phone ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserByPhone"])(phone) : null;
    const key = `${phone ?? ""}\0${user ? JSON.stringify(user) : "null"}`;
    if (key === cachedUserKey) {
        return cachedUser;
    }
    cachedUserKey = key;
    cachedUser = user;
    return cachedUser;
}
function getServerUserSnapshot() {
    return null;
}
function AppProvider({ children }) {
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getUserSnapshot, getServerUserSnapshot);
    const setUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[setUser]": (u)=>{
            if (u) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveUser"])(u);
            else (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
        }
    }["AppProvider.useCallback[setUser]"], []);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[refreshUser]": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyUserListeners"])();
        }
    }["AppProvider.useCallback[refreshUser]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[logout]": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$user$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
        }
    }["AppProvider.useCallback[logout]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AppProvider.useMemo[value]": ()=>({
                user,
                setUser,
                refreshUser,
                logout
            })
    }["AppProvider.useMemo[value]"], [
        user,
        setUser,
        refreshUser,
        logout
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers.tsx",
        lineNumber: 78,
        columnNumber: 10
    }, this);
}
_s(AppProvider, "T+ZL7llzSQISsarJXEihFtKI5ww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = AppProvider;
function useApp() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
_s1(useApp, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_13by1yc._.js.map