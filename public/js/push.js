let webPush = require("web-push");

const vapidKeys = {
    publicKey: "BEZMbAUdXX0MVpEhnRTyaxf6r1Bu2losm3ce66oY9JIkvZJeBqy81HAAGMNcF4Vr5NtinL6vYS2R5MDSsaoEw9Y",
    privateKey: "P1H3a_K8vEttpwz2DsHY9pWYRww3zhmj9CaIGkdxSlw",
};

webPush.setVapidDetails(
    "mailto:example@yourdomain.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
let pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/cSVY5Wbb2Gw:APA91bFfn_Ux8CK77xZd0hu8MMp73j214WohEJ2-ww6PDXwMcsu49DxR-bRJxYlXSJCt3Xis7RmKa0Sufc_l3SBoRJxqPutpkTWlfNTlnZnhvj520ul5Jn_nWRHRx2cNFdZFpWFz7vAv",
    keys: {
        p256dh: "BLhWbewHymdBskdtUR+gLzWxO+ZZkdvOwTXEXc4UxHsYSALGfDuQ/ecLq0f7UtmtHZVi/qCwpI2L3tUc0BFvmYA=",
        auth: "1xpmi4A3dhtS/cLyCv98Mg==",
    },
};
let payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

let options = {
    gcmAPIKey: "695490443216",
    TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);