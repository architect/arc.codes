# Assigning a Domain Name

> Assign a fully qualified domain name to your `arc` application

Setting up DNS is a necessity if you intend to assign a domain name to your deployed application. This guide lists ways to set up custom DNS with several popular DNS providers and we are always happy to accept contributions for steps to use additional providers.

## The Easy Way
`arc` has built-in support for setting up DNS with AWS Route 53, and assigning a domain.

1. Add [`@domain`](/reference/domain) to your `.arc` file with a value of the domain name you wish to set up
2. Invoke [`npx dns`](/reference/arc-dns) and follow the instructions

> Note: Should you want to manually create or modify other DNS entries for your domain, you still retain the full flexibility and configurability of Route 53. `arc` is only concerned with provisioning the necessary records to make your application available under your domain.

## The Not-Hard-But-Not-Quite-As-Easy Way

If you _really_ want to manually configure DNS you can follow these guides below:

* [Route 53](#route-53)
* [Cloudflare](#cloudflare) 

<a name="route-53"></a>
## Route 53

Follow these instructions to manually configure Route 53 to serve your application from your domain. As a friendly reminder: the `arc` happy path for using Route 53 remains the [`@domain`](/reference/domain) section (per the instructions above).

> ⛳️ Tip: These instructions will serve your app's production environment; if you'd also like a friendly URL for your staging environment (i.e. `staging.foo.com`), follow steps 10-15 below a second time, swapping `production` values for `staging` values.

1. Sign into the AWS Console, head to the Route 53 service, and click on **Hosted Zones**
2. Create a **Hosted Zone**
3. Copy the designated name server addresses to your domain registrar
  - Note: if you register your domain via Amazon, this happens automatically
4. Sign into AWS Certificate Manager
5. Request a certificate
  - Protip: set up both `example.com` and `*.example.com` for use with subdomains
6. Follow the instructions to verify the certificate
7. Sign into AWS API Gateway
8. Click on **Custom Domain Names**
9. Create a **Custom Domain Name** for `production`
10. Fill in the form:
  - Enter the exact FQDN you intend to use (i.e. `arc.codes` or `www.foo.com`) in the **Domain Name** field
  - Select the **ACM Certificate** you just verified
  - Enter `/` in the **Path** field
  - Select your app's `production` API name in the **Destination** menu
  - Select the `production` value in the **Stage** menu
11. Copy the value of the generated **Distribution Domain Name** to your clipboard
12. Head back to Route 53 and click into the domain in question
13. Create a **Record Set**
14. Fill in the form:
  - If setting a subdomain, enter it in the **Name** field
  - Set **Alias** to `yes`
  - Enter **Distribution Domain Name** you just copied to your clipboard into the **Alias Target** field
15. Create the `Record Set`
16. Perhaps grab a cup of coffee or tea ☕️ – it can take a few minutes while AWS wires everything up!

<a name="cloudflare"></a>
## Cloudflare

These instructions are adapted from the tutorial at [LEANX](https://www.leanx.eu/tutorials/set-up-amazons-api-gateway-custom-domain-with-cloudflare) and updated to our most recent experience deploying this documentation site to AWS, using `arc` and custom DNS via Cloudflare. Your mileage may vary.

1. Ensure that your domain is registered and is using the Cloudflare name servers and that your `arc`-generated application has been deployed to AWS
2. In your AWS management console, go to the Certificate Management service, and ensure you are in the US East (N. Virginia) aka `us-east-1` region
3. Click on "Import a certificate"
4. In a different browser tab or window, log into Cloudflare, select your domain and open the `Crypto` tab. In the SSL section, ensure SSL is set to **Full**
5. Scroll down to the **Origin Certificates** section and click `Create Certificate`
6. Let Cloudflare generate a private key and a CSR and choose RSA as the private key type
7. Make sure that the hostname for your custom API domain is covered (i.e. `api.foo.com`). You can specifically configure this custom domain or use a wildcard such as `*.foo.com`, as is configured by default
8. Pick PEM as the key format which is selected by default
9. Copy the Certificate body from your Cloudflare certificate to the **Certificate body** field in the AWS Certificate Manager
10. Copy the Private key to the **Certificate private key** field in the AWS Certificate Manager
11. In the **Certificate chain** field in the AWS Certificate Manager, copy the [Cloudflare Origin CA - RSA Root found here](https://support.cloudflare.com/hc/en-us/articles/218689638-What-are-the-root-certificate-authorities-CAs-used-with-CloudFlare-Origin-CA-)
12. Click **Review and import** and then import the certificate. Take note of the first eight characters of the certificate's identifier as you will need that to select the correct certificate in a later step
13. In the AWS Console, return to the region in which you are deploying your architect-generated application and then go to the API Gateway Service
14. Click on **Custom Domain Names** and then **Create Custom Domain Name**
15. Enter your custom domain name in the AWS Console and select the certificate which you created earlier and noted the identifier
16. Add any **Base Path Mappings** as necessary for your application
17. Now the custom domain name will be created in AWS CloudFront. It can take up to an hour before the domain becomes active
18. The final step is to create a new CNAME record in Cloudflare to link your custom domain to the CloudFront URL which you can copy from the Distribution Domain Name in the Custom Domain Names console. Ensure that the option 'DNS and HTTP proxy (CDN)' is selected for this CNAME after creation

<hr>
## Next: [Implement CORS](/guides/cors)
