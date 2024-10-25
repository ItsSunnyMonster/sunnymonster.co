import { Context } from "@netlify/functions";

// function objectToURLSearchParams(obj: Record<string, any>): URLSearchParams {
//   const params = new URLSearchParams();
//
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       params.append(key, obj[key]);
//     }
//   }
//
//   return params;
// }
//
// export default async (req: Request, ctx: Context) => {
//   const code = new URLSearchParams(new URL(req.url).search).get("code");
//
//   const new_request = {
//     grant_type: "authorization_code",
//     code: code,
//     redirect_uri: "http://localhost:8888/.netlify/functions/__callback",
//   };
//
//   try {
//     const response = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization:
//           "Basic " +
//           Buffer.from(Netlify.env.get("CLIENT_ID")!).toString("base64"),
//       },
//       body: objectToURLSearchParams(new_request).toString(),
//     });
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     const responseData = await response.json(); // Parse JSON response
//     return new Response(JSON.stringify(responseData), {
//       status: response.ok ? 200 : response.status,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// };

export default async (req: Request, ctx: Context) => {
  return new Response("Why are you calling this.");
};
