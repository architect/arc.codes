# Custom DNS

Setting up custom DNS is a necessity if you intend to use a custom domain for your deployed application. This guide lists ways to set up custom DNS with several popular DNS providers and we are always happy to accept contributions for steps to use additional providers.

To use Amazon Route53:

1. Ensure your project `package.json` has `dns` entry under `scripts` per [workflows reference](/reference/npm-run-scripts)
2. Add `@domain` to your `.arc` file with a value of the domain name you wish to setup
3. Invoke `npm run dns` and follow the instructions

If you _really_ want to manually configure DNS you can follow these guides below:

* [Route 53](#route-53)
* [Cloudflare](#cloudflare) 

## Route 53<a name="route-53"></a>

1. Sign into AWS Route 53 and click on Hosted Zones
2. Create Hosted Zone
3. Copy the name server information to your domain registar (if you register with Amazon this happens automatically)
4. Sign into AWS Certificate Manager
5. Request a certificate (protip: setup both `example.com` and `*.example.com` for subdomains)
6. Follow the instructions to verify the certificate
7. Sign into AWS API Gateway
8. Click on Custom Domain Names
9. Create Custom Domain Name
10. Enter the **Domain Name**, **ACM Certificate** you just verified, **Path** `/`, **Destination** API name and **Stage** of `staging` or `production`
11. Copy the value of the generated **Distribution Domain Name** to your clipboard
12. Sign back into Route53 and click into the domain you want to enable
13. Create Record Set
14. Set **Alias** `yes` and **Alias Target** to the **Distribution Domain Name** you just copied to your clipboard
15. Create the Record Set (and be patient it can take a bit for everything to wire up)

## Cloudflare<a name="cloudflare"></a>

These instructions are adapted from the tutorial at [LEANX](http://www.leanx.eu/tutorials/set-up-amazons-api-gateway-custom-domain-with-cloudflare) and updated to our most recent experience deploying this documentation site to AWS, using architect and custom DNS via Cloudflare. Your mileage may vary.

1. First, ensure that your domain is registered and is using the Cloudflare name servers and that your architect-generated application has been deployed to AWS.
2. In your AWS management console go to the Certificate Management service and ensure you are in the US East (N. Virginia) aka us-east-1 region.
3. Click on "Import a certificate".
4. In a different browser tab or window, log into Cloudflare, select your domain and open the "Crypto" tab. In the SSL section, ensure SSL is set to "Full".
5. Scroll down to the "Origin Certificates" section and click "Create Certificate".
6. Let Cloudflare generate a private key and a CSR and choose RSA as the private key type.
7. Make sure that the hostname for your custom API domain is covered. E.g. api.mydomain.com. You can specifically configure this custom domain or use a wildcard such as `*.mydomain.com` as is configured by default.
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
18. The final step is to create a new CNAME record in Cloudflare to link your custom domain to the Cloudfront url which you can copy from the Distribution Domain Name in the Custom Domain Names console. Ensure that the option 'DNS and HTTP proxy (CDN)' is selected for this CNAME after creation.
