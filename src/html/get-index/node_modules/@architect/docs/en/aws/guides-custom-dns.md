# Custom DNS

Setting up custom DNS is a necessity if you intend to use a custom domain for your deployed application. This guide lists ways to set up custom DNS with several popular DNS providers and we are always happy to accept contributions for steps to use additional providers.

Jump to DNS provider:
* [Cloudflare](#cloudflare)
* [Route 53](#route-53)

## Cloudflare<a name="cloudflare"></a>

These instructions are adapted from the tutorial at [LEANX](http://www.leanx.eu/tutorials/set-up-amazons-api-gateway-custom-domain-with-cloudflare) and updated to our most recent experience deploying this documentation site to AWS, using architect and custom DNS via Cloudflare. Your mileage may vary.

1. First, ensure that your domain is registered and is using the Cloudflare name servers and that your architect-generated application has been deployed to AWS.
2. In your AWS management console go to the Certificate Management service and ensure you are in the US East (N. Virginia) aka us-east-1 region.
3. Click on "Import a certificate".
4. In a different browser tab or window, log into Cloudflare, select your domain and open the "Crypto" tab. In the SSL section, ensure SSL is set to "Full".
5. Scroll down to the "Origin Certificates" section and click "Create Certificate".
6. Let Cloudflare generate a private key and a CSR and choose RSA as the private key type.
7. Make sure that the hostname for your custom API domain is covered. E.g. api.mydomain.com. You can specifically configure this custom domain or use a wildcard such as *.mydomain.com as is configured by default.
8. Pick PEM as the key format which is selected by default.
9. Copy the Certificate body from your Cloudflare certificate to the "Certificate body" field in the AWS Certificate Management Console.
10. Copy the Private key to the "Certificate private key" field in the AWS Certificate Management Console.
11. In the "Certificate chain" field in the AWS Certificate Management Console, copy the Cloudflare Origin CA - RSA Root which can be found here: [https://support.cloudflare.com/hc/en-us/articles/218689638-What-are-the-root-certificate-authorities-CAs-used-with-CloudFlare-Origin-CA-](https://support.cloudflare.com/hc/en-us/articles/218689638-What-are-the-root-certificate-authorities-CAs-used-with-CloudFlare-Origin-CA-)
12. Click "Review and import" and then import the certificate. Take note of the first eight characters of the certificate's Identifier as you will need that to select the correct certificate in a later step.
13. In the AWS console, return to the region in which you are deploying your architect-generated application and then go to the API Gateway Service.
14. Click on "Custom Domain Names" and then "Create Custom Domain Name".
15. Enter your custom domain name in the AWS console and select the certificate which you created earlier and noted the identifier.
16. Add any Base Path Mappings as necessary for your application.
17. Now the custom domain name will be created in AWS Cloudfront. It can take up to an hour before the domain becomes active.
18. The final step is to create a new CNAME record in Cloudflare to link your custom domain to the Cloudfront url which you can copy from the Distribution Domain Name in the Custom Domain Names console.

## Route 53<a name="route-53"></a>

Coming Soon

