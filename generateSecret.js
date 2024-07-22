// generateSecret.js
const { generateSecret, exportJWK } = require("jose");

(async () => {
  // HS512 알고리즘에 적합한 512비트 대칭 키 생성
  const secret = await generateSecret("HS512");

  // 생성된 비밀 키를 JWK (JSON Web Key) 형식으로 내보내기
  const jwk = await exportJWK(secret);

  // JWK 키를 Base64 URL 안전 형식으로 인코딩
  const secretKey = jwk.k;

  console.log("Generated Secret Key:", secretKey);
})();
