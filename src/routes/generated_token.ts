import { FastifyInstance } from "fastify";
import { AuthenticationContext } from "adal-node";
import { getEmbedUrl } from "../util/embed_token";

export async function tokenRoutes(app:FastifyInstance) {
  

  app.get('/token', (req, res) => {
    //DATA APLICATION
    const clientId = `${process.env.MICROSOFT_CLIENT_ID}`; 
    const resource = 'https://analysis.windows.net/powerbi/api'; 
    const reportId = `${process.env.MICROSOFT_REPORT_ID}`;

    //AUTH
    const tenantId = `${process.env.MICROSOFT_TENANT_ID}`; 
    const authorityHostUrl = 'https://login.microsoftonline.com';
    const authorityUrl = `${authorityHostUrl}/${tenantId}`;

    //DATA USER
    const username = `${process.env.MICROSOFT_USERNAME}`;
    const password = `${process.env.MICROSOFT_PASSWORD}`;

    //GET TOKEN
    const context = new AuthenticationContext(authorityUrl);
    context.acquireTokenWithUsernamePassword(resource, username, password, clientId, async (err:any, tokenResponse:any) => {
      if (err) {
        console.error('Erro ao obter o token de acesso:', err);
        res.status(500).send('Erro ao obter o token de acesso.');
      } else {
        const accessToken = tokenResponse;

        const embedToken = await getEmbedUrl(accessToken.accessToken, reportId)

        const data = {
          token: accessToken.accessToken,
          embedToken: embedToken.embedUrl,
          id: embedToken.id
        }

        res.send({ 
          data
         });
      }
    })
  })
}