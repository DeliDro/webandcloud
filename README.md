# Contributors

- Amar TIOUS
- Dro Kieu DELI
- Leo PORTEJOIE

## Problème rencontré

Au moment de configurer l'accès à l'API, nous avons rencontré un problème que nous n'avons pas pu résoudre.
A l'éxécution des commandes suivantes, 
```
mvn clean package
mvn endpoints-framework:openApiDocs
```
Aucun problème, mais à lexécution de :
```
gcloud endpoints services deploy target/openapi-docs/openapi.json
```
Nous avons ce message d'erreur: 
```
ERROR: (gcloud.endpoints.services.deploy) INVALID_ARGUMENT: Cannot convert to service config.
'location: "unknown location"
```
Et après une très longue période de recherche, nous n'avons trouvé aucune solution permettant de résoudre ce problème dans notre cas de figure.


Par conséquent notre API et notre application web ne peuvent pas être exécuté correctement.

# Rendu

Malgré ce problème majeur, nous rendons tout de même le lien de notre application:

Et sur ce github vous pouvez retrouver les programmes (Java et html) des pages web ainsi que de l'API.

