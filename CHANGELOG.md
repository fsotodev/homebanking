# Changelog

### Para generar changelog con diferencias hacia master:
git log --pretty=format:"%H - %s" --no-merges master.. >> ../dif_master.txt
### Para generar changelog con commit en rango de dias:
git log --after="2022-01-04 00:00" --before="2022-01-06 23:59" --pretty=format:"%H - %s"

## Version 2.33.0

HBK

* SQHP-660 URLs dinámicas Seguros - PWA/Firebase (A12)

FIDELIZACION

* SQFYCC-752 Nueva posicionar botón de crear benéfico
* SQFYCC-786 Homologar rama SQFYCC-164-segmented-benefit-creation
* SQFYCC-865 Permitir categorización de beneficios segmentados
* SQFYCC-873 Activar campo benefitDiscount para todas las creaciones de beneficios
* SQFYCC-901 Mejoras varias para beneficios segmentados
* SQFYCC-932 Beneficios para todos los productos
* SQFYCC-961 Nueva Botonera
* SQFYCC-997 Cambiar el tipo de los beneficios segmentados para que no se visualicen en la PWA antigua
* SQFYCC-1021 Revisión Admin para c1c2


## Changelog
0dd1563bde9bb99a9b3ee7ec475f0d9609b17008 - [SQFYCC-1021] Fixed lint errors, deleted console.log.
f9ca21b3d2ed25f6d4a07f9617093c4a0a23d6fd - Fixed overflow bug in header. Fixed the observable that controlled the functionality of the radio buttons codes. Fixed the observable in step seven of benefit creation that didn't add validators to the active fields when editing.
db88811b41981a1efd4579ca965bee0ce96570df - [SQFYCC-1021] Fixed lint error.
d53a51a1f994951cfa3c760fa11aa607a5a18651 - Added warning text under header title that shows only when firebase or fstorage is pointing to prod and the url is not the prod url
f85cc300f93ee382193c7a498dc4d92321de89f3 - Added a line to set model that setted de selectedSegmentationType to the selectedSegmentation of the newBenefitService class.
478b08b0b241ba37c7cb5a240026fc80ea27b71e - Change the position of the id variable so it can be used by any other functions in ngOnInit. Fixed the functionality that obtains the current codes of the benefit so that now it will not crash after the uploading of multiple files. Reseted the value of both input elements in upload-codes and upload-ruts so that you can trigger the change event with the same file. Fixed a line in the method that updated the benefit codes in the firebase service so that knows what to do if the filePath doesn't exist in the benefit.
d88af0a75adedad6e3d354b19fa8008a4f67a060 - Added a ternary to the method in firebase.service that updated the stock so now it will not result in NaN. Added an operator to tab-code so if codesStock doesn't exist will show 0 instead of nothing.
c2e0b81f50d9bcca2da6b88083313064cf2dd632 - [SQFYCC-997] Modified the function that changed the newBenefit.Type if the benefit was segmentated by category so that now it will change the type of all segmented benefits. Modified the function that changed the type if the benefit was segmentated by product or if it required only MCB to use it so that now it will change the type only if the benefit exclusively requires MCB
ff64fa26bd76eb3153b12391bca283ff4827637c - Fixed lint errors
0f977a867f1c563e3ae7d6f5db07fd750b3decd1 - [SQFYCC-961] Added a few functions to benefit.service so the benefits can have backwards compatibility
1ce8a079877c93107520c3acfa6dd18778b2037e - Corrected the text of the new cards so it will look simillar to the older ones
eae4aa2354fc8cb35242e57512c1f934c6420b91 - Deleted a few fields that i forgot to delete in the previous commit.
9b6e9bc3853cff146bd498fb4640ecc3c0edb874 - Deleted the fields of the previous cards. Deleted multiple comments and fixed a few lint errors.
0bcd0fa55a8b45f6c12c05f6bd98bb26ba397b96 - [SQFYCC-961] Modified the new-benefit.ts model to allow the new cards. Added two new checkboxes for the new cards in benefit-step-two.component.html. Added the necessary change to benefit-step-two.component.ts to allow for the debit mastercard vista and debit mastercard cc. Modified the new-benefit-preview.component.ts and .scss so they will work correctly with the new cards
979239b5185933cf2862e6ef3855610df8f34814 - [SQFYCC-873] Instead of using a new control with ngIf i modified the placeholder to dynamically change his placeholder. Fixed a lint error in 7th step of new benefit creation

## Version 2.32.0
* SQHP-623 Carga dinámica colecciones ADM - Seguros

## Changelog
23d256a51e308e60bceb16fbaa4ca8ff9ac38002 - remove position relative
39a9a4d606b1b1647d1219e576193a2ae1506c94 - clean of the html father
aecf1d7f7dad05b45215e6bba482b92af6ae0a5c - change the order of the architecture of components
c93e1adce511c09c1ebfd43f1c64248810af2919 - change the timer of notification
69c178b82eb5f8363f2513b70c9b9258eef9c664 - delete unnecesary interface xD
bd72afe54e227c1f69741b0cdfe04c516bc64536 - resolve bug of file input and generate a dinamic component to handle the success and errors
a27b7ee8e02a8d736e9ef74763a4367ec3dc9836 - fixing lint and update de type of functions
72e30ad4320fe8ba05999841313ad01bebf4abb9 - dinamic validation on inputs and refactoring html to suport new validations
1b2c6f8a24dc64989761837176e7e275a02cdee3 - capturing de value of the collection an adding the reset to the reactive form
ba4a4245c3b08e268a0a037dfb9b062fad8a466e - it develops bulk data upload with unic field
20485c4cf6c09d89ced905e2c1462f4b30167b89 - implement bulk load, slice in the text document and format rut
39e1302ec7633ed891ecb5eb74438a5ebb6a79b5 - add remove input fields and read the csv to transform in another object
777de11be89e218eacde01a70f6c4e70f71bcb0e - finish secure layout
787879172c89d16db2fa9af970ffdbef196050a0 - Jenkinsfile edited online with Bitbucket
0bbc6543a819acaec168e99234710dea13a99f7c - first commit integration upload file

## Version 2.31.0

Fidelizacion:

* SQFYCC-602 [Admin] Gestión categorias de beneficios (Tipos de categorías)
* SQFYCC-603 [Admin]Modificación en creación/edición de beneficios para tipo de categoría
* SQFYCC-604 [ADMIN] Refactorizacion home beneficios
* SQFYCC-605 [Admin] Creación de sección del banner para dashboard de beneficios

## Changelog

1f13ce4a4366b1ee062d484a727d67665d356bc7 - [SQFYCC-602] Delete select old code benefit type on edit benefit category
1ef7690268c15cbe066225313d60375e12bc9c99 - [SQFYCC-602] Fix banner css button and eye icon. Fix css add benefit button
d963532b3801727215709936c66850f3fa011df8 - Update jenkinsfile for deploy to development wit branch SQFYCC-602-admin-gestion-categorias-beneficios
b6f82573c2bff162188cc42624276469debe6dc6 - Update jenkinsfile for deploy to development wit branch SQFYCC-602-admin-gestion-categorias-beneficios
4d226ff29c33a76eba738fdf58be5e0d11e4d997 - [SQFYCC-604] Add support for old benefit types
98236c113828eefbc211648b756baa3ddcd1272e - [SQFYCC-604] Changes visibility number on benefit home
b99afbefc8897972dd08a98df431ef98a54a5701 - [SQFYCC-604] Changes on home benefit. Use news benefit types


## Version 2.30.0

* SQHP-541 Fix - Filtro todo usuarios ADM

## Changelog
2cb965b2756b6fe4e562f330b3e4653927625fea - SQHP-541-fix-filtro-todo-usuarios-adm - DONE

## Version 2.29.0

FIDELIZACION

* SQFYCC-470 [Admin] Des-asignar ruts de beneficio para tí no funciona

## Changelog
98214b4919866c891ffb57ddf589586600c35fbd - deallocate benefits by rut
## Version 2.28.0

FIDELIZACION

* SQFYCC-458 -[Admin] Corrección segmentos benefits, no selecciona "agregar fila"

## Changelog
22ccb0007ddad21a7e0d26fff821634b4aaa343c - [SQFYCC-458] Fix add, edit and delete  new segmented benefit.
ca76f95a3e6f868927d47dc62e5ebc4fc5925f25 - version 2.27.0
c19f3f4605826c04c5f22c177dfdca5b43687af6 - [SQFYCC-484] Add id selection on delete redeem process
## Version 2.27.0

* SQFYCC-484 - [Admin] Función eliminar canje, no funciona para canjes en estado "pending"

## Changelog
c19f3f4605826c04c5f22c177dfdca5b43687af6 - [SQFYCC-484] Add id selection on delete redeem process
## Version 2.26.0

* SQFYCC-485 - [Admin] Reporte descargable canjes GC, formato alterado
* SQFYCC-407 - [Admin] [Pwa]Cambio en path de cloud-functions apiProd
* SQFYCC-387 - [Admin] mejorar e implementar mensaje de error en la carga de código

## Changelog
8f2b48273e4692b9e3c23b6831fdb21798908636 - Update sonarsource/sonarcloud-scan:1.4.0
9781071d2ee50c899121c08c740f114d08246c43 - feat correccion boton
c6962923ef3efba4bfd0fc8ddbcdda1b4e8f8663 - feature: change validCodes in firebaseService
28f46f863a0e4744e8a714bd423c587a1c6b8372 - tsconfig.json target: "es5"
61793f3dc51586c25fc65dc09720748b386ed35c - [SQFYCC-407] Modify api host and path configs
2889df9371a975e9990e6dbc4311bf3e88a4d6ef - version 2.25.0
467b1990ac4725dcdbe8adfbc3ba378d93650608 - [SQFYCC-397] benefit segments permissions
## Version 2.25.0

FIDELIZACION

* SQFYCC-397 -  [Admin] Creacion de acceso a edición de sección benefits- segmentos

## Changelog
467b1990ac4725dcdbe8adfbc3ba378d93650608 - [SQFYCC-397] benefit segments permissions

## Version 2.24.0

* SQFYCC-364 - [Admin] [TRE] - Reporteria de transacciones agregar hora
* SQFYCC-352 - Creación de sección de edición de beneficios de segmentos

## Changelog
7d51110d0f5d818b937dbbd9cffd275f7033cd8b - [SQFYCC-364] Add hour to productTransactions report and fix creationDate on view
dd0c22cba1d8413b7b2251926e136785e984d184 - [SQFYCC-352] benefit segments admin

## Version 2.23.0

* SQFYCC-376 Corregir el quitado de filtro de producto activo a descarga de códigos inválidos

## Changelog
6eb88106f7b4e687dd39bb1ed5db36a9971e0b41 - [SQFYCC-376] Fix get invalid product codes stock
12def8f9eecdf1e4bb7754ce268a798b8050ad45 - FIX SERVICE ACCOUNT FOR DEVELOPMENT DEPLOY


## Version 2.22.0

* SQFYCC-337 - Crear sección de eliminación de transacciones de clientes (canjes) en admin
* SQFYCC-351 - Quitar filtro de producto activo a descarga de códigos validos e inválidos

## Changelog
9cb0324df7be1278a6aba3e2a0059e833dc78489 - [SQFYCC-351] Fix titles in download valid and invalid codes, add stock on select product, disabled select for zero stock
d95e5f50300c6064749fa691ff76ec8433e7c8f8 - [SQFYCC-337] Delete extra pipes and lines
60af3e1e9ad91dccd8d450d61ead050c235802fd - [SQFYCC-337] Add delete product transacctions function
586ec1c41d722b3d40e518de98d67eecb8adb2aa - [SQFYYC-337] Add delete productTransactions menu, and basic functions

## Version 2.21.0

* SQFYCC-285 Catalogo canjes - vista detalle producto (ADMIN)

## Changelog

88a4ff79ec744dbded6b5d6fa1160b0a9d261450 - [SQFYCC-285] new fields in product and category for new product catalog

## Version 2.20.0

* SQFYCC-281 Agregar campo de código único a editor de beneficios (Admin) v2.20

## Changelog
2e8ceb80977c29243013fda57c71eb75864ba4b9 - sqfycc-281-add-unique-code

## Version 2.19.0

* SQFYCC-211 Administrador Canje destacado

## Changelog
ab8649dddc77459f038f3087fceffda711e951cb - [FYYCN-211] delete comment code and console.log
0881dfc234a20d7338af8bc2b9689f88a511e8e6 - [FYYCN-211] fix css problems on featured redeem
8198bcb84a5e02f96f3016b6d43dcd989884ad20 - [FYYCN-211] change featured redeem preview to mobile view.
88a587f6a49cd158a956040aabae78c2c1975d1f - [FYCCN-211] Fix preview and add product list admin, fix css problem
59ff846376b6f74699704f5c2495e78a2bee77e4 - [FYCCN-211] Add preview and fix products list
56fa640e1aac3fc74c193958ba6681db3b99987c - [FYCCN-211] add upload images and products list
3667ee71f231a4b5efd2fc2812e38ab947384bcf - [FYCCN-211] Fix title form validation
604f3cc32ab4ee2cab337154ed8a16012cdec2a8 - [FYCCN-211] Add featured redeem from

## Version 2.18.0

## Changelog

* SQFYCC-233 Modificar la edición del producto, nuevo campo selector de grupo -Nuevo catálogo de canjes

## Changelog

539c1244529c6f088dbbfa5e12e276feb4c8b99c - [SQFYCC-229] change model of redeem group
c752b96db13365fc02b706658f22dff53cc086fb - [SQFYCC-233] [SQFYCC-229] product group assign and group list enhancements
34171b1c24717000d46abaed72fc59024174fe4a - [SQFYCC-229] redeem group edition

## Version 2.17.0
Canales

* HPN-296 [ADM] Fix - linkear buscador con tabla genérica Slider y Welcome

## Changelog
222c70bbe13611eb2200798a957192c361556ae6 - HPN-296 fix search in generic table

## Version 2.16.0

Canales
* HPN-296 [ADM] Fix - linkear buscador con tabla genérica Slider y Welcome

Fidelización
* FYCCN-194 Quitar limitación de descarga de transacciones de supercanjes

## Changelog

## Version 2.15.0

HPN-268 Implementar tabla genérica en Welcome "old"
HPN-271 Implementar tabla genérica en Slider "old

## Changelog
44267639d43be530dd3eea41db33e73d2021210b - HPN-271 fix past obs lint
12b909d7ca7fed6ed45b57df2d4167967ebe0640 - HPN-277 fix chatbot onoff
4e2fdd162dad9f4dd78679c477db9e68dff61c4f - HPN-268 HPN-271 generic table impl
de49cad08a9302696e685ace1389cf2ace8cdd93 - HPN-268 HPN-271 add implementation slider-welcome


## Version 2.14.0

FIDELIZACIÓN

* FYCCN-168 Fix carga de códigos y rut

CANALES

* HPN-115 [ADM] - Crear componente menu lateral
* HPN-238 Administrador Firebase - Crear tabla generica para campañas

## Changelog

ac0384ba0155841954d63a8a3578f097ace18cf2 - HPN-115 menu lateral custom
7ba2cc565b192ed1ec4e0237491ad06de3d87745 - FYCCN-168-fix-loading-codes-ruts
cd58a5d89f683fd59787a5fc58a99e19166e8afb - [HPN-232] corrections in comparative
baab6c58c0b4a387e7b6444e152ba89ee5d727e4 - HPN-134 solve color checkbox and lint
0b3efc2f23ea695e98bee9cae8d3cb177e236ed9 - [HPN-232] migrate function to utils
fcdb221b0b979fba4a5af81bca02a450fb8e7ca0 - [HPN-232] corrections typed
1f9dffceecbd32e957124fb466c48f8b56c3aace - [HPN-232] lint in files slider and welcome
5632cfcfcb5628099ca50baa56f2ae189c922141 - HPN-134 changes generic table
8dc69946127d2c85046fe7e9834e11374e8471fe - [HPN-232] add interface to form slider and welcome
d930823674f9f34e538eda9b3cfc1ce5e1265cde - [HPN-232] add interface slider and welcome
de0ac5920e0058099d2ca3acfc1555893de012e4 - [HPN-232] add interface


## Version 2.12.0

FIDELIZACIÓN

* Fidelización y Clientes
* FYCCN-138 [Admin] Descarga de cod canje válidos/vencidos no muestra productos en administrador
* FYCCN-9 Sección de carga de códigos y rutero de beneficios (Admin)
* FYCCN-147 Tarjetas que aplican en beneficios

## Changelog
0af586b23e24c97a87949eaabd58d430af793d6b - [FYCCN-147] new combinations for benefit cards
adbfe65f0a3c0a0fc64b5bfe39b77a0fee29c94e - FIX-FYCCN-9-section-loading-codes-ruts
491e349f2a23fd0c6a753d0960d52e4136611659 - [FYCCN-138] fix codes download (valid and invalid)
203df420873d8c155ff4bd13caac556c9fc60eb8 - FIX-FYCCN-9-section-loading-codes-ruts

## Version 2.11.1

FIDELIZACIÓN

* FYCCN-156 Fix Create Benefits

## Changelog
e4a45d799795c50921714734d985699e6a9718d7 - rel-2.11.1
c50668cb6e1b7925dc93cd696f3568f5ae78fd0e - [FYCCN-156] fix old model of benefit and filters

## Version 2.11.0

CANALES

* HPN-211 Agregar opción Mobile-Desktop en Slider en PWA - ADM
* HPN-132 Administrador firebase- Sección ver campañas home.component
* HPN-221 Campaña CONSU TEST no permite actualizarla - Slider ADM
* HPN-220 Algunas campañas no permite actualizar/editar - Welcome ADM
* HPN-230 Fix isCustom para Welcome

FIDELIZACIÓN

* FYCCN-9 Sección de carga de códigos y rutero de beneficios (Admin)
* FYCCN-125 Eliminación vista 1.0 beneficios (lógica admin)

## Changelog
9547a2c67d88cadf13ef47ba90c8d8eb13659d77 - [HPN-230] include validate isCustom in Welcome
acf9aeb1fbfb0583f5b3198609073e0b8f48fe9e - FYCCN-9-section-loading-codes-ruts
ebdbf45b9052f74655bc97b680a97d02f4cc39ee - comment validations and fixes
93b8af8f0b99a08db04ec4e00917fee9a83dbd08 - FYCCN-9-section-loading-codes-ruts
8fc81680d21431fe626b21e28932a395a5a0c354 - [FYCCN-125] enhancements benefit model
5406526f4a82999e1763ceb2878520020cd73eaa - change validator in pagePWA
b79b7b111a49110e24eaecf7d02072a861e9ee0e - change validator in pagePWA
8c545c1b17dce5d5f0e752aff91db35feb2e9844 - [FYCNN-125] benefit view v2
c97eea938542af8fcd3d85ab787a72e588bb7fd7 - [HPN-32] deleted important label
421ed11a17e8640f135cd7111457d175c0a8ea57 - [HPN-221] control isCustom is undefined
41527c31de71b0189f608506df2183b6f58894c3 - [HPN-132] v1
0dfdc292db2afb37482479547cb56ed14550cfc5 - FYCCN-9-section-loaging-codes-ruts

## Version 2.10.0
CANALES

* HPN-175 Agregar Cta Cte al checkbox de productos en ADM
* HPN-189 Actualizar campos obligatorios (o no) en Slider - ADM
* HPN-191 Editar lógica selección dispositivos en Slider - ADM

## Changelog
38c3782b32d9f0ee6543f0766f83eff9c3664f42 - HPN-189 fix lint and add modal error in validation
0e60e862efbc273fe5dfedaf8d5c6e825c2b87bb - [HPN-189] merged with HPN-191  2
024be2b2f5cb3e65cc5acb4969b6f69e6cb4f007 - [HPN-189] merged with HPN-191
d921c74dc822a320ab9d021792337b681b14a426 - [HPN-189] update device in campaing old
40573dfaaff3fda1aab6dd76fca04146386a9756 - [HPN-189] conditions of products required
d36b20b62f082cb06a2af1373853c112ac90477a - [HPN-189] update button campaing
eed64b6e403911748fbf5ae9543e040551da1a35 - [HPN-189] merge version hpn191
d5728727b74a5f0e9ebb22fdfc607de28223172d - [HPN-189] add text welcome and validation in submit
af43b25a74f4c2ca6546c1b7c58ef681a1805ad3 - [HPN-174] [Modificar parámetros obligatorios en Welcome - ADM][findRedirectionUrl method]
93bc82d046b2dd9bad744e8f7b3aac816dfc03cf - descoment deploy development
767b7fcae25f1707931c594231a025e71da57e9b - [HPN-174] [Modificar parámetros obligatorios en Welcome - ADM][Cuenta Corriente]
fba4f6d308caf6c236ffbef3655fe56190bd70d4 - [HPN-174] [Modificar parámetros obligatorios en Welcome - ADM]

## Version 2.9.0
Canales

HPN-169 Bloquear caracteres "prohibidos" en ADM

## Changelog
31d968ec3986359e187509e093c3091234ab76d4 - HPN-169 blocking and cleanning id slider-welcome campaigns

## Version 2.8.0
CANALES:

* HPN-161 Descarga de algunas campañas (.csv) vacías en Slider y Welcome

FIDELIZACIÓN Y CLIENTES

* FYCCN-99 Permisos edición welcomepack

## Changelog
b31cf9d9a8374aebb2174cace89e515853720846 - [HPN-161] add type in cleanCampaign
af2dfdcb4f4c4bf4ca80e6a7d20d303bb821bc7d - VPCCNMC-240 - admin popup pwa-banners


## Version 2.7.0
Canales
* HPN-164 Error en creación de campaña (slider, welcome): se borra el id durante la creación - ADM

Fidelización y Clientes

* FYCCN-99 Permisos edición welcomepack
* FYCCN-109 Sección de descarga de transacciones de supercanjes en Admin
* FYCCN-111 Revisión carga de códigos unimarc

## Changelog
476b42e01112749731c5d76c440357ff6602e7bc - [HPN-167] change in screems multiple variable
56255669aacae2827ec5685f3af88c5a31608246 - HPN-167 cleanning disabled
572632355b4b3165023f6dd10b51e56daf5683b1 - [HPN-167] function cleanCampaing clean id
52820e7d23d3c29712c44c5c4a5fc2e700857e2f - [HPN-167] [block_edit_id_campaign][jose]
75c41b10fb6b9bd4cf59a27377b8d810f4e30158 - HPN-167 change position disable in slider
7a8828381b6b14eeded14122f9b25feaa7e24b99 - HPN-167 blocked change id in campaign generate problems
e676fa8abe12fe087d5338df1cd9237e1adf3451 - [FYCCN-109] Remove blank line
2325ec9919399ec2f284ed1e82c396e58adef882 - [FYCCN-109] Add download product transactions with superCanjes restrictions
156a0679575b0dc97f39bee97225f2faf510a38a - [FYCCN-99] fix access permission for welcomepack


## Version 2.6.0
Canales
* HPN-133 Administrador Firebase - Crear componente base crear/editar campaña
* HPN-114 Administrador Firebase - Crear estructura en form-base
* HPN-159 Cambio de nombre de campaña copiada en Slider o Welcome, modifica la prioridad a "0"
* HPN-164 error en creación de campaña se borra id

Fidelización y Clientes

* FYCCN-116 Permitir información de dirección, horarios y teléfono en todas las plantillas de beneficios, no sólo restofans
* FYCCN-120-fix-loyalty-service

## Changelog
6fa090a6c8ff6edd0fe597edf3223e2681584b30 - [HPN-133] corrections
e67e63fc87631205a7a962e521602a463d33968c - [HPN-133 change in border color
1e19c9b945161322941d8ae9a91b30012e80f815 - [HPN-133] style order
67df0bf51dc57351d5aa79a3548a0fdfdd910001 - [HPN-133] merge with hpn-114
939b1df279fb8e25b20987d4fce9da48431781df - [HPN-133] styles v3
32f88a6ee04a9c9b746c9897770905df08b88fa2 - [HPN-114] add base structure for br styles
24b5264ddef31628e4de5c9c931b11a0261d5453 - [HPN-114] add base structure for br styles
bf5de986293442d2a023bff9e5c4b5e589b21ac7 - [HPN-114] [Adm estructura base] [FIRST COMMIT]
16cf4a0953932edee2cf407d13b59ce3f368bcbb - HPN-159 set priority after copy
144700356d35b9637b17db167949ead35c8a8ac3 - change long description for short description on new benefit preview external view
b3f4ab9267101defba23b05b25d16304623f346d - Remove require restofan template for adress, direction and schedule fieds
7a2a12e73f4a6d52da8daa9e3b83fca2341dd106 - FYCCN-120-fix-loyalty-service
e28edd730b846cafa2ab94a4ffdd8e05117f6e3f - [HPN-133 change styles
d7ba18da11a2a9a59736b604a6007e15098bbf0d - [S/I] generate version 2.5.0
a5a5ac8c3abc6dffd66f12420142951de9cc25ee - [HPN-133] base structure anidated forms
e2ae4b8fe93da9d154ddaf3b3a3dfe34e05052da - [HPN-133] base structure anidated forms
6831c0f2d46f46b82b778bcdc7fe1e3443617e67 - [NPN-133] 2 version
5d638ab167b1e2606ff97c2049bfadaf63acb67a - [NPN-133] 1 version

## Version 2.5.0

* HPN-131: Campo Máxima Visualizaciones no sea obligatorio de completar - ADM
* HPN-62: Administrador Firebase - Crear estructura base Layout, header, modulo camapaña
* HPN-139: Error en orden prioridad listado de Campañas (slider y welcome) en ADM
* HPN-142: Problema en descargas de views y goals de los Pop-up y Slider
* HPN-144: Copia de campañas en ADM con campos vacíos
* HPN-145: Se visualiza en Slider campañas "vacias" sin nombre - ADM
* FYCCN [S/I]- Fix benefit admin 2.0 (date)
* FYCCN-112 Fix Authentication Firebase User

## Changelog

21b6f8d78c59665ed2ecb25bbea4170fc8b01405 - resolve conflict
709c6abac824fb77aba11a07222d8d8be190ab9d - Merge remote-tracking branch 'origin' into development
f080460496f67c1675505fcd044d5fded4a7557f - Merged in hotfix-FYCCN-112-fix-authentication-firebase-us (pull request #138)
d00364714b85ed4d8a448550939d071bb75e9bf1 - [FYCCN-112] get user tokenId from Firebase
2c2ad88c35ec8a7739bb91f98da124116e182d15 - Merged in HPN-139-error-en-orden-prioridad-listado (pull request #137)
fb6a14255a5602733825b4fd2b439f2d39a13790 - [HPN-139] [Error en orden prioridad listado de Campañas (slider y welcome) en ADM] [FIX SOLVED]
08e1086025aaa86969782bc3ddcb4a106505c5ac - Merged in FYCNN-SI-fix-benefit-admin-date (pull request #136)
e20460c5644ffc0a88f974165e3b39e66739609b - Merge branch 'development' into FYCNN-SI-fix-benefit-admin-date
2d19be5cfc992621ed1cc855143394a2687e00bb - FYCNN-SI-fix-benefit-admin-date
98db904af7eb1525ad7ca5ee1c5725bc44b5d9dd - Merged in HPN-142-problema-en-descargas-de-views (pull request #135)
134fc4b500b8d4d5978804ee9e384c39f4d65451 - [HPN-142] [Problema en descargas de views y goals de los Pop-up y Slider - ADM] [FIX SOLVED]
227df948914db3f9dc5aeb4c6e7df5725a3a3dc2 - Merged in HPN-144-copia-de-campañas-en-adm-con-cam (pull request #134)
24325d31fdfa524f8d9cd17938d6c884eedf1cbf - [HPN-144] [Copia de campañas en ADM con campos vacíos - ADM] [FIX SOLVED]
c6b75ecba2bd1864b463bcf2fd0fed5e0e39e673 - Merged in HPN-131_campo_máxima_visualizaciones (pull request #130)
36402e8b495754cbea375f846a01af5687a00e51 - Merged in feature/jenkins-pipeline (pull request #133)
bbab8df2a275d898111d24c89d5ffdb0287e0115 - prueba deploy
40a8b79fbf780d7c6375e6c88e8be683f4ac1fc1 - Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature/jenkins-pipeline
61b7f2e483edaa967f0a5390f6b304d3ba6cceb1 - prueba de despliegue con npm ci
950b4c6159a62640a3e898311efa8f02a654be60 - Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into development
078c001ae7c6bdc19be4ba10a28416e3ec7d11fe - actualiza version de node en pipeline
2a9cb2412186953ca7e446b1a7125efd1f9b9d7d - Merged in staging (pull request #127)
aeecb00cbe6a7ccd24e44f2edf57b80296df0aa7 - Merged in HPN-117-admin-revisión-warning-commonjs- (pull request #132)
fd5ac79dfffc9100d063bacafe53561230b75991 - Merged in HPN-62_estructura_base (pull request #128)
5869d5aecaf8309c81a7dbf721bb673dd6679bfd - comenta stage de deploy a development, por pruebas de subida de version
bbd41a34cbc4c1883ee942c2e3879140d82e3048 - Merge branch 'development' into HPN-117-admin-revisión-warning-commonjs-
c374aa50e296cf479551ebba4b59996397d0f2f2 - [HPN-62] generate structure for campaign module
cb7e2b6952ed927370fcdd60e43377795b2bb229 - [HPN-62] move header components to shared module
a444a71a49cef6a7f47e3294fad535d6c1e61884 - [HPN-62] move header components to shared module
e2ca26435986e49ef8a254415ae5b92bc63431f2 - [HPN-62] change import scss to abosulte path
80fe7c3737dd50116c0b054aa8afd1c304c22c2e - [HPN-62] add layout and routing
153952c7d73e29cd7256c64a65d99a5748074b26 - [HPN-62] add layout and routing
51da96ba0b09340f20c9b8b0817db2125f5cab66 - Merged in rel-2.3.1 (pull request #121)


## Version 2.4.0
* FYCCN-23 Previsualización de mejoras beneficios en administrador
* FYCCN-80 Mejoras mensajes de error y éxito en carga de códigos
* FYCCN-83 Redirección de notificaciones push

* HPN-56 Subir la versión de angular
* HPN-129 Correcto orden por prioridad de listado de campañas en Welcome - ADM

## Changelog
04e31c21119f8e93141468e0ca5eb8ad131f7682 - Actualiza post
84e3367f0e873db10704f91a328c2e2995eecf65 - oculta token firebase
d59167093a068e4b71831a2e8940ed76a82a205a - Prueba deploy+builñd agente nuevo
797e9e62671452f73749a0c682ecedece791cd24 - Prueba deploy en dev
174b96c063aa340f565669eb4a66929e1727af20 - [HPN-129][Correcto orden por prioridad de listado de campañas en Welcome - ADM][Fix Solved]
00dbd085e4920c3004db35a88f0349889bc0c617 - Remueve STASH SOURCE CODE FOR SCANS
5d78f80e4b30881ec2c7cf2b728852320b748ea9 - fix lint and aot
cfdc7db06b7ab44426bd61437ec1c9eb5277feaf - fix aot
94660ce7ee8aed1ff2810d96f00c8978fdc789d1 - remove log
71614ff1e481222855c2e459f83bcf9225adbe14 - remove redundant assignment
7cc9789fcb5265cb3dc267605e831d949bfb7e7f - Actualiza jenkinsfile para descarga de firebase-tools
7963e6369e10a65dfb7c387b3317e34f0aae701c - Agrega beforeagent a security scan
32c7c84931e6406e9d291d339b219475905b42b2 - fix show list preview
0cf7de9c3d05a59ddfb9a1f3f95f9ccaa572ccaa - DEVOPS-1020 - Libreria fortify
246d4791f5605953e7866805fd3d5ee275c07a26 - Jenkinsfile edited online with Bitbucket
11c04c9a7b128ac49aaa3a8f8ffbbc9248657b89 - when fortify
2a14da5f94bd201d8c8b22cb32ab52276d22f306 - Jenkinsfile edited online with Bitbucket
da3ecbde81de8aab1a3a4eec61fbb92ac3b2260a - Testing pipe after minor lib change
e154302348af2106bfa4db4a9cdba73d747d4c94 - fix date input
bfb3996404fc2ab7aa238ef1568a13bb0b2685a5 - [FYCCN-80] Divide the code submission process into groups of 100 and add the message to see the progress
61059b49f4a6597271741e80c9633c4e52ba0b91 - [FYCCN-83] new redirection options in redirections
3f6894d461318e2d097e94b92f3e0fb9109b8062 - prueba agente nuevo deploy
6992e12169a6b083f05db5b8020f46a00248661f - Jenkinsfile edited online with Bitbucket
9b90d24b118641e577757e81cb60fdbdad05a3f2 - Jenkinsfile edited online with Bitbucket
082e2941ccfe1978d906b900f7ae3e6e05f9660c - hide opional fields
a518009d1940ed99e9d1a4b07332443c04ae56e4 - fix download dependencies
a1be06a57df3e3598416bdc64a36790f5c19f5ee - fix script en deployment
5cffe376b19f2390a52b78603aa3d3f936ccd5c7 - Actualiza notificaciones slack
8ddf663df13480223eda75d4ee37ccec383f5c68 - Fix notificaciones slack


## Version 2.3.0

* HPN-33 Subir la versión de angular del administrador

## Changelog
646f7f403be6a7e2a9eb9640373c14256a71b833 - [S/I] resolve conflicts merge development

## Version 2.3.1

* HPN-33 Subir la versión de angular del administrador

## Changelog
646f7f403be6a7e2a9eb9640373c14256a71b833 - [S/I] resolve conflicts merge development

## Version 2.3.0

* HPN-102 Fix de cargar rutero antes de crear la campaña completa- Adm
* HPN-103 Incorporar el parametro "máximas visualizaciones" en Slider- ADM

## Changelog
9b2885b3b88a1e6f9c2ad9ed3a12afeb776d6585 - [HPN-102][Fix de cargar rutero antes de crear la campaña completa- Adm][Peer Review Fixes]
2b87445f402251471b1a7a233497f5ea6fa03956 - [HPN-102][Fix de cargar rutero antes de crear la campaña completa- Adm][Development finished]
f525749fa9f8b86cb01430af273fcb40a0e1f6b5 - [HPN-102][Fix de cargar rutero antes de crear la campaña completa- Adm][Development finished]
d744270018c8d9468bec88e6b3a95ef2c86a0334 - [HPN-102][Fix de cargar rutero antes de crear la campaña completa- Adm][Development finished]
a1106cb3b1a0d11d3fb0aa40dc7857a4165e560f - [HPN-102][Fix de cargar rutero antes de crear la campaña completa- Adm][Development finished]
35c0292c8cde1c0b0efb8c963731627333317230 - test
7ec986e92a5fce45501547e0cdfc56d7f57da9e6 - Agrega install de firebase y angular cli en pipeline
2ed10b9357791bc1298f6efe7709e55e070d9f25 - Actualiza version de node en readme, descarga de dependencias en pipeline jenkins y package-lock
9a38442168a1bba640387889c474ab35fad49f67 - [HPN-103] add maxviews slider

## Version 2.2.0

CANAL

* HPN-30: Botón de acción "volver al inicio" al crear una nueva campaña
* HPN-32 Incorporar nuevo indicador al modulo de campañas  (%crt)
* HPN-31 Indicadores en linea ( views, goals y clicks)

VENTAS

* VPCCNMC-20 Agregar al administrador de campañas banners internos de consumo
* VPCCNMC-21 Agregar descarga de views y click en administrador para banners internos

FIDELIZACIÓN

* FYCCN-22 Administador mejoras beneficios.
* FYCC-1083 admin benefit
* FYCC-85 Corregir administrador de Welcomepack
* FYCCN-84 Fix Administrador (detalles new benefit)
* 
## Changelog
38bba0c4a6cc223586031b340ae15a2f2066104a - generate versiion 2.2.0
468a6245ab61edcaca3cd247c28fa1c3f028a31b - [FYCCN-85] add creation of cards fields on welcomeCampaignUser wher upload rutero
3a44de88d18a7cdd9f80509676c6d64cb41130dc - [s/i] hotfix-update-admin-benefit
a5a85288b0c3ddfc77de2805948b89a344541b53 - [HPN-32] avoid division by zero
fa63f6f2a74cd13348d1b97229e145a31560ec76 - [HPN-32] homologate columns slider and welcome, add new indicator %CRT
b7c2dbc3c5f2aa7d7ec0bee7851ef2156f508454 - delete log
70f0e9ab8b2b986d176eec26ba65bcdf12874326 - delete log
dac1e74e51ad79b1315a4e16b2521af6526d70e7 - consumer credit simulation - campaigs banners
db7bf69e0d3aa5c09654ee1ff6347d9341851be5 - [HPN-31] delete consolelog
fa2d445f7f7880ffce4a9364d997041b209be140 - [HPN-31] add n/a when not found document
8d2d3f43077304f55cf1947cd6eeafab8b405ace - [HPN-31] new order in call


## Version 2.1.1
[FYCCN-84] fix-admin-benefit
[FYCCN-81] modificar-proceso-de-descarga-d

## Changelog
e355cb33fb94c683833f4e603d97efafb3b806ce - Merge branch 'development' into FYCCN-84-fix-admin-benefit
4c93163ec972e2f1b4cf1cf4d9a0352fca973941 - Merged in feature-FYCCN-81-modificar-proceso-de-descarga-d (pull request #94)
466a0cff502170d0c056981062c627188d5b82c6 - clean ternary conditions
d3fe41dc2dbdf814c179d813e14c108de2d880b8 - Merge branch 'development' into feature-FYCCN-81-modificar-proceso-de-descarga-d
4f914df93597e4c87f8c5a8eb0d8f905f26b2f18 - [FYCCN-81] add async request all valid and invalid product codes report
0cb99115640d16d2b1a107ac3dfe4d29bdab2345 - fix test
05c1f35f27fab4292e176090402cf28a344009db - fix model newBewnefit

## Version 2.1.0
[FYCCN-22] Administador mejoras beneficios.
[FYCC-1083] admin benefit

## Changelog
9a1891297cc269f72c2263658503d860d247bfed - Merged in development (pull request #87)
1330966ab269ec106fe2bad1c6a73978a061e125 - Merged in FYCC-1083-admin-benefit-preview (pull request #83)
2894f2b82eb8e3f7fe71809b4dab30f761a0fead - delete dbugger

## Version 2.0.0
* Actualiza pipeline para descarga de dependencias en master
* Merged in feature/jenkins-pipeline (pull request #78)
* Merged in HPN-23-modal-de-cambio-de-nombre-de-imag (pull request #79)
* [HPN-23][Development finished]
* Actualiza canal slack
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature/jenkins-pipeline
* Agrega master a la descarga de dependencias
* Agrega fortify
* Agrega descarga de dependencias para deploy en master
* Merged in FYCCN-4-automatic-benefits-load (pull request #73)
* DEVOPS-955 - Primera version README DEVOPS
* Merged in HPN-8-manejo-error-carga-datos-admin (pull request #72)
* [HPN-8][Observations made during pull request] -> [Corrections resolved]
* [HPN-8] Upload file ruts error handler added
* [HPN-8] Upload file ruts error handler added
* Merged in FYCCN-27-carga-de-códigos-por-id (pull request #71)
* [FYCCN-27] Fix Lint
* [FYCCN-27] Modify validation of load code  file
* [FYCCN-4] fields document and parameter not required anymore in new upload config
* Merge from development
* [FYCCN-27] Delete select category for load product codes
* Merged in feature-FYCC-1075-encriptacion-codigos-de-canje (pull request #69)
* Change css and logic of pre validation of file
* Merged in FYCCN-8-mejora-copia-e-historial-de-ruts (pull request #70)
* Change select for table on load product codes
* Revert format changes
* [FYCCN-8] Apply default data in copied av simcampaign
* [FYCCN-8] Apply default data in copied dashboard campaign
* [FYCCN-8] Add set default data  copied campaign method to campaigns-engine
* [FYCCN-8] Apply change in copied slide campaign
* Fix delete of rut csv of new welcome campaign
* [FYCCN-8] Add "Copia de" to avsav campaign
* add Copia in new welcome campaing id and delete rut csv
* [FYCCN-8] Add "Copia de" to benefit title when is copied and set status to "No Publicado"
* Merged in HP-263-historial-de-ruteros-en-banners (pull request #65)
* [HP-263] Missing semicolon
* Merge branch 'development' into HP-263-historial-de-ruteros-en-banners
* Merge branch 'development' into feature-FYCC-1075-encriptacion-codigos-de-canje
* Merged in HP-259-pasar-al-administrador-el-rutero (pull request #68)
* Merged development into HP-259-pasar-al-administrador-el-rutero
* [S/I] fix
* Merged in HP-259-pasar-al-administrador-el-rutero (pull request #67)
* [HP-259] correction variable name
* Merged in FYCC-1168-Minime-banner-redirect (pull request #66)
* [FYCC-1168] grammatical fix
* [FYCC-1168] adds redirect to Benefits page in minime banner
* Merge branch 'development' into HP-263-historial-de-ruteros-en-banners
* Merged in HP-261-copy-pantallas-pop-up-en-admin (pull request #63)
* Agrega archivo de configuración sonarlint
* Agrega archivo de configuración sonarlint
* [HP-263] Final development
* [HP-263] Final development
* Merge remote-tracking branch 'origin/HP-263-historial-de-ruteros-en-banners' into HP-263-historial-de-ruteros-en-banners
* [HP-263] Refactor duplicated code
* Merge branch 'development' into HP-263-historial-de-ruteros-en-banners
* [HP-263] Refactor duplicated code
* Merge branch 'development' into HP-263-historial-de-ruteros-en-banners
* Merged in HP-259-pasar-al-administrador-el-rutero (pull request #61)
* Screens load when user wants to copy a campaign
* Refactor code
* Refactor code
* duplicated code
* Modifications - historial de ruts is not going
* Modifications - historial de ruts is not going
* Historial de ruts Added
* Historial de ruts Added
* [HP-259] change scss v4
* [HP-259] change scss v3
* [HP-259] change scss v2
* [HP-259] change scss and add console
* [HP-259] change to variable name v2
* [HP-259] change to variable name
* [HP-259] add card reissue v2
* [HP-259] add card reissue
* Merge branch "development" into feature-FYCC-1075-encriptacion-codigos-de-canje
* Actualiza pipeline para despliegue en producción
* Merged in HP-264-pop-up-de-confirmación (pull request #59)
* Merged in HP-272-errores-y-bugs-encontrados-en-adm (pull request #60)
* Pull request comments resolved
* Pull request comments resolved
* Errores y bugs encontrados en Administrador de beneficios (Development) - FIXED
* Bugs fixed
* Merge branch 'development' into HP-264-pop-up-de-confirmación
* Merged in FYCC-1119-desencriptacion-de-codigos-admin (pull request #58)
* Merge branch 'development' into FYCC-1119-desencriptacion-de-codigos-admin
* lint fixes
* confirmation poppup in minime campaign added
* Remove test console.log and var dont used
* Add loading image for load valid and invalid codes
* Modify all code invalid and valid download
* Merged in FYCC-1110-benefit-download-filters (pull request #57)
* remove unused variable
* methods control access for template
* Merged in FYCC-1110-benefit-download-filters (pull request #56)
* Add get product codes and productTransactions from new cloud function api
* fix indentation, changed from 4 to 2 spaces and methods access control
* Adapt model of invalid product codes report for new api
* Add getCodesSubCollection and enviroments related. Adapt model of valid product codes report fornew api
* code enhancement to avoid duplications in download
* remove unused variables
* FYCC-1110 add benefit id filter and download CSV
* Merged in custom-campaign-minime (pull request #54)
* get variable from engine
* Merge branch 'custom-campaign-minime' of bitbucket.org:banco_ripley/homebanking-pwa-admin into custom-campaign-minime
* flow correction
* Merged development into custom-campaign-minime
* length function
* Merged in HP-232-agregar-detalle-de-fecha-y-hora-e (pull request #55)
* Change csv format creation, firstTime column added
* sonar cloud
* sonarCloud
* restore variable and validate file
* uploadFolder
* sonarCloud
* add format
* remove duplicate variables
* comment correction
* encryption product codes
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into custom-campaign-minime
* cleaning
* code cleanup
* update custome minime
* add ruts and validations
* Merged in FYCC-1077-add-logs-on-transaction-creation (pull request #53)
* allowEmpty: true
* Actualiza imagen docker
* Agrega stash source_code jenkinsfile
* VPPFF-618 - Primera version de pipeline bitbucket-sonar
* Actualiza canal de slack
* Fix some lint and getParsedDate function
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into FYCC-1077-add-logs-on-transaction-creation
* Merged in FYCC-1076-agregar-logs-para-descarga-de-codigos-admin (pull request #52)
* Changes to decouple code and improve performance
* Delete test comments
* Change all to TODOS in cvs log report of download-valid-product-codes
* Add default case on download logs
* Adding logs on load product to client and available on download logs
* Add log to download invalid product codes and to download logs page
* Add log to download valid product codes
* Actualiza pipeline dev
* form-create
* Merged in fix-pipeline-dev (pull request #51)
* merge JenkinsFile
* Merge branch 'development' into fix-pipeline-dev
* Merged in FYCC-1067-upload-promotion-banner (pull request #50)
* page restructuring and change bucket folder
* Catch for banner not found
* Add required on promotional banner form
* Corrige package json
* test
* test
* test
* VPPFF-565 - Prueba pipelines
* New section for promotional banner (Update Firebase)
* New section for promotional banners (Front and get info from firebase)
* "@bit/kunder_dispositivos.ripley-poc.web-components": "0.0.5"
* Merged in fix-access (pull request #49)
* Add access to export and download logs
* test
* Merged in feature-FYCC-883-download-logs-from-admin (pull request #47)
* cambia canal slack test
* test
* Primera prueba pipeline
* test npm install
* prueba
* comenta tareas de sonar y fortify
* Merged in feature/jenkins-pipeline (pull request #48)
* VPPFF 238- Actualiza descarga de dependencias y test
* VPPFF 238- Implementación inicial CICD
* Access type download-logs
* New section for download logs
* Merged in fix-max-len-load-prodct-codes (pull request #46)
* Change maxLen for first column on load product codes
* Merged in FYCC-898-fix-welcomepack (pull request #44)
* Merged development into FYCC-898-fix-welcomepack
* Clean commented code
* Fix preview cards WP
* Merged in hotfix-load-product (pull request #45)
* increase product name length in load product form
* Uninstall uuid, using base id for Group_id on welcomepack
* Update filters by category
* Merged in feature-hp85-banner-slider (pull request #38)
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature-hp85-banner-slider
* fix update campaigns slider
* Merged in HP-133-pop-up-y-banner-slider-con-quema (pull request #43)
* burn campaigns add goals to slider
* Merged development into feature-hp85-banner-slider
* Merged in hotfix-back-redirection (pull request #42)
* Modified redirection after config modifications
* Merged in hotfix-image-previsualization-embedded-login (pull request #41)
* Added dimensions to image box
* Fusionado en FYCC-960-change-code-canje (solicitud de integración #40)
* merge
* validation in product
* change code canje
* Fusionado en FYCC-964-redirect-to-rpgo-from-banner-admin (solicitud de integración #39)
* add redirect dashboard ripley punto to welcome campaing
* Add redirect to dashboard
* Merge branch 'feature-hp85-banner-slider' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature-hp85-banner-slider
* fixed update campaign custom banner slider
* Merged development into feature-hp85-banner-slider
* modified collection to custom campaigns
* Merged in develop-embedded-login-image-upload-improvements (pull request #37)
* Added option to delete image (in order to use default ones). Fixed undo behavior. Reorganized flex boxes
* adde custom banner slider interface
* aaded logic to save custom banner campaigns
* added logic to create custom banner slider campaign
* Merged in VPPFF-138-embedded-login-images (pull request #32)
* Merged in feature/FYCC-949-fix-push-stasts-marketing (pull request #36)
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into VPPFF-138-embedded-login-images
* Fix ratio on stats
* Adding extension .csv
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature/FYCC-949-fix-push-stasts-marketing
* Fix on push-stats: getting date, download remarketing and text on html
* Merged in develop-bro3133-negativeProductsTrackingOfClaims (pull request #34)
* Merged in hotfix-benefit-codes (pull request #35)
* Remove plus sign
* Change function name on push-stats (reload -> reloadMarketingCampaigns)
* line break in csv creation
* line break in csv creation
* Fix totalRuts and totalSent on push-stats, and added a limiter for stats per campaign
* add changes of development
* Merged in FYCC-932-pruebas-motor-notificaciones (pull request #33)
* se agrega checkbox para convertir tipos de datos
* Merge pull request #154 from kunder-lab/develop-bro3133-negativeProductsTrackingOfClaims
* delete console.log
* add logic for negative products
* Removed unused variables
* Added new view to modify the embedded login images
* Merged in hotfix-download-benefits (pull request #31)
* Change text on HTML and adding styles
* Merged in FYCC-913-descargar-benefits-del-admin (pull request #30)
* Add section for download benefit codes
* Add section for download benefit transactions
* Merged in FYCC-891-update-stock-at-upload-codes (pull request #29)
* Merged in BRO-3013-benefits-tags (pull request #21)
* Merged in FYCC-882-dias-expiracion-cupon (pull request #28)
* Update stock of product at upload codes
* new deltaForTechnicalDateInDays field is not required
* delete debugger
* FYCC-882-dias-expiracion-cupon
* delete blank space
* Merge branch 'development' of https://bitbucket.org/banco_ripley/homebanking-pwa-admin into development
* remove .vscode settings
* resolve merge conflict
* Merged in FYCC-868-save-admin-users-data (pull request #25)
* class in one line
* add .
* Merged in FYCC-826-nueva-categoria-one-admin (pull request #23)
* Merged in hotfix-minime-preview (pull request #27)
* hotfix-minime-preview
* Merged in hotfix-minime (pull request #26)
* Hotfix minime form
* Merge branch 'development' of https://bitbucket.org/banco_ripley/homebanking-pwa-admin into development
* Log user info in firestore for some actions
* Merged in fix-campaignss-property (pull request #24)
* fix campaigns property in pages
* rename property of campaigns filters
* Merge branch 'development' of https://bitbucket.org/banco_ripley/homebanking-pwa-admin into development
* option ONE CATEGORY is added in campaign engine -> create
* Merged in hotfix-campaigns (pull request #22)
* Hotfix campaigns forms
* set width .main-table
* remove console.log
* set min-widht to .mat-column-modifyOrDelete
* enable relationship tag benefits
* enable save tagBenefitRelationship
* show tag modal benefit
* disable tag on edition mode
* Merged in develop-hp57-chatbot-integration (pull request #20)
* Merged development into develop-hp57-chatbot-integration
* Merged in develop-HP104-banner-for-device (pull request #19)
* datalayer
* Chatbot on/off
* enable cancel button
* add style to order number
* comments deleted
* order list on delete tag
* add edit tag functionality
* Merged in FYCC-817-nuevo-banner-minime-con-boton (pull request #18)
* add filter platform for slider-avsavsim-minimi campaigns
* Merged in FYCC-843-admin-fix-excel-with-codes (pull request #17)
* Minime with button en form and list
* Fix download on campaign
* add edit tag view
* add benefit tag edit
* set order
* Change columns on CSV for codes and sort category
* Back to delimiter with comma
* Add Tag, Remove Tag, Tag Enable
* add style to tag list
* Adding space and force string format on excel
* add form tag
* add material chip
* delete console .logg
* add tag component
* add tag menu
* Merged in bump-version-1-4-0 (pull request #16)
* Minor fixes
* Version Bump 1.4.0 :)
* Merged in revert-pr-12 (pull request #15)
* Revert "Brach without redeem updates (pull request #12)"
* Merged in develop-hp100-sos-admin (pull request #13)
* Minor fixes
* Merge qa
* Merge branch 'development' into qa
* Merge pull request #153 from kunder-lab/develop-bro-3047-dv-customer-service
* White List and fixes
* Merged in brach-without-redeem-updates (pull request #12)
* Fix variables for deploy
* Revert "[NO MERGE] new codes collection - load, download, and text changes (pull request #9)"
* Platforms config and count limit
* Digits fixes
* add text for customer service
* Merged in feature-wp-improvements (pull request #10)
* Merged in FYCC-771-codes-refactor (pull request #9)
* Merged in FYCC-815-sgment-push-by-so (pull request #11)
* Login config page
* Update digits
* add set data to firebase
* add section for customer service, on off for producs and DV
* Adding Inputs for Allowed Systems for App
* fix: add function definition to sort
* fix: sort itemLists by order
* fix: if a weekdaytag input value is empty do nothing
* feat: add msg remembering to upload "ruteros" later
* feat: add image sizes to slider imgs inputs
* feat(cardswp): add checkbox to show advanced configs
* fix(wp): add missing prop
* fix(welcomepack): correctly display the benefit preview component
* feat(welcomepack): change titles
* fix(welcomepack): stop setting product dates to false
* fix(benefits-wp): title changes and load all benefits instead of active ones
* feat(welcomepack): change titles
* Merged in feature-add-welcomepack-form (pull request #5)
* feat(benefits-screen): change values on mat autocompelte change
* remove comma
* new codes collection - load, download, and text changes
* fix(new-benefit.component.ts): include empty tags
* fix(benefit.service): don't default weekdays to array
* chore: remove clogs
* feat(benefit-screen): enable weekdays and welcomeImage updatae
* fix: productsForExclusiveBenefits to array
* fix: rename products label
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature-add-welcomepack-form
* fix: remove pristine
* fix: remove debugger
* feat(welcomepack): add rut input field
* Merged in fix-logic-options-notificacions (pull request #8)
* Add condition on cancelSend
* Fix logic menu options
* Merged in FYCC-778-improve-admin-campaigns (pull request #7)
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature-add-welcomepack-form
* feat(welcomepack): set default color
* Pull from development
* Fix logic canDelete
* Adding paginator on notification campaigns
* feat: set correct initial values
* feat: add slider benefit radio group
* Merged in qa (pull request #6)
* Merge branch 'development' of https://bitbucket.org/banco_ripley/homebanking-pwa-admin into qa
* Change options buttons to dropdown and fix toDate() from firebase
* Merged in CHP-491-crear-admin-listuploadconfig (pull request #3)
* Merge branch 'CHP-491-crear-admin-listuploadconfig' of bitbucket.org:banco_ripley/homebanking-pwa-admin into CHP-491-crear-admin-listuploadconfig
* Change form of UploadConfig
* Merged development into CHP-491-crear-admin-listuploadconfig
* Merge branch 'development' of bitbucket.org:banco_ripley/homebanking-pwa-admin into feature-add-welcomepack-form
* fix(welcomepack): add missing fields to the edit form
* chore: use productos instead of benefits
* fix(wp): add missing fields
* Merge pull request #152 from kunder-lab/develop-fycc-742-change-category-from-go-to-plus
* Merge pull request #151 from kunder-lab/feature-add-welcomepack-form
* chore: use specific versioning
* feat(wpscreens): add id validators
* feat(cardswo): add id validator
* feat(cardswp): add secondaryTitle products
* feat: redirect to welcomepack listing
* style: add mat-button directive
* style: remove unnecessary button
* style: add horizontal padding to buttons
* style(benefit): add horizontal padding to buttons
* fix: change 'points' to 'puntos'
* feat(wp): redirect to the welcomepack list on save
* style(list-wp): use 'puntos' instead of 'points'
* feat(ripley-puntos): set item's default color
* feat(welcomepack): load specific benefit screens by product
* feat: add productsForExclusiveBenefits field
* style(new-welcomepack-campaign): use css class instead of style attr
* style(list-welcomepack): remove json pipe
* Merged in FYCC-760-improve-push-notification-upload-img (pull request #4)
* feat(welcomepack): add pager data to welcomepack
* Change input from string to upload-img
* feat(welcomepack): remove editing functionality
* feat(welcome): single edit form
* fix(welcome): set correct benefit preview key
* feat(welcomepack): add links to create screens
* Change Go to Plus (on HTML)
* feat: rename components
* Merge branch 'qa' of github.com:kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* style: lint
* Merge pull request #143 from kunder-lab/develop-add-bronzeCat-banners
* feat(welcomepack): validate base id
* fix(cards): integrate christian fixes
* feat(welcomepack): enable search bar
* style(welcomepack): update texts
* feat(welcomepack): handle welcomepacks w/o groupId
* feat(welcomepacks): add new wp list
* Version bump 1.3.0
* Merge branch 'qa' of github.com:kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* Merge pull request #150 from kunder-lab/hotfix-new-status-for-push
* Change orderBy and remove log
* Adding new status for push
* Change Bronze category to Go category (Just visually)
* Merge branch 'qa' of github.com:kunder-lab/ripley-banco-admin-beneficios into develop-add-bronzeCat-banners
* change cardId by id
* Merge branch 'feature-add-welcomepack-form' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* feat(benefit-screen): add benefits async validations
* Merge branch 'feature-add-welcomepack-form' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* feat(welcomepack): use cardWPScreen id
* Merge branch 'feature-add-welcomepack-form' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* feat(benefits-scree): update button container
* Merge branch 'feature-add-welcomepack-form' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* feat(welcomepack): integrate cards screen
* feat(benefits-screen): update buttons layout
* changes admin config upload
* feat(welcompack): Add edition functionality
* Merge branch 'feature-add-welcomepack-form' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into feature-add-welcomepack-form
* feat(cardswp): add form to create/update/copy
* feat(auth): change from session storage to local storage
* feat(welcomepack-form): add benefit and ripley point selects
* Merge pull request #149 from kunder-lab/develop-stats-adjustments
* Merged in CHP-492-modificar-administrador-notifica (pull request #2)
* feat(ripley-points): create/update/copy form
* Percent fix
* style(benefits-screen): add margin to save button
* feat(benefits-screen): add benefit screen to create/update
* CHP-521 changes new behavior manual and automatic definition notif push
* comment inputs under validation
* remove debug tags
* validate ripley points preview component
* Merged in merge-from-github (pull request #1)
* Merge remote-tracking branch 'origin/development' into merge-from-github
* add card item click handler
* add card screen form
* New columns
* Add benefitsWP form
* separate ripleyPointsWP into it's own form
* Add preview screen: ripleyPointsWP
* Add ripleyPointsWP benefits section
* Add ripleyPointsWP main title field
* Add campaign date range inputs
* Add filter section
* Set route access validation
* Add basic form fields
* Create welcome campaign component
* Stats now load immediately after campaigns
* Merge pull request #148 from kunder-lab/develop-order-query
* Added order by modified date to campaigns in stats
* Merge pull request #147 from kunder-lab/develop-optimize-stats
* Optimized stats loading. Added field to get data on demand rather than on init
* Merge pull request #146 from kunder-lab/develop-bro2927-adding-img-in-campaign
* URL with image has to be jpg or png
* Adding URL for image in campaign
* Merge pull request #145 from kunder-lab/develop-bro2916-improve-push-notification
* Change click event to change event for PWA checkbox input
* Adding input for redirection on Web Push Notification
* Merge pull request #144 from kunder-lab/hotfix-data-overload
* Added file download with xlsx format
* Added batch read to all push types. Refactored code
* Modified default values
* Batched read for simulation push. Added flag to avoid reloading data
* Fixed error when loading redeem data
* Added eye icon for queries without download
* Stats are now loaded on demand, whenever the user interacts with the download button
* add bronze category to banners
* Initial commit
* Fixed issue with large data arrays. Marketing calls are now synchronous (temporal fix)
* Merge pull request #140 from kunder-lab/develop-bro2816-chatbot-onoff
* Merge pull request #141 from kunder-lab/hotfix-permissions
* Reverted auth guard changes
* Modified box styles
* Fixed disabled state. Deleted unused code
* Fixed form state
* Added generic on off view for boolean flags
* Merge pull request #139 from kunder-lab/develop-bro2813-product-redirection
* Merge pull request #138 from kunder-lab/develop-extract-push-stats
* Added specific permissions for push stats. Fixed document download
* dropdown in product selection
* Added remarketing stats
* Added marketing data download
* Removed unused import
* Added redeem stats
* Added ID to push campaigns list
* Added transactional data. Modified marketing user list
* Read marketing stats
* Merge branch 'qa' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into develop-extract-push-stats
* Merge pull request #137 from kunder-lab/develop-admin-refactor
* Added statistics view
* Merge pull request #136 from kunder-lab/develop-bro2759-dashboard-banner
* Remove logs
* Rever changes in app.module
* Increase max lenght in product form
* Dashboard campaign form
* update commit
* Added local-prod compiling. Modified es version to es2018
* Merge pull request #135 from kunder-lab/develop-add-formatCsv-Validation
* delete consolelog
* add limit csv validation
* add validation and modal options
* Minor import fixes. Added temporary ts supressions
* Merge branch 'qa' of https://github.com/kunder-lab/ripley-banco-admin-beneficios into develop-admin-refactor
* Added persistent session
* Merge pull request #134 from kunder-lab/hotfix-benefit-edition
* Added missing fields to benefit structure
* Merge pull request #132 from kunder-lab/develop-bro2739-silver-benefits
* Merge pull request #133 from kunder-lab/develop-2750-dataCard-historial
* fix spaces
* rename function
* add sort-instructions
* delete comments
* fix uploads ruts data cards, and add record upload files
* Added silver promotion fields to benefit edition pages
* Merge pull request #131 from kunder-lab/develop-bro2686-formated-csv
* Merge branch 'qa' of github.com:kunder-lab/ripley-banco-admin-beneficios into develop-bro2686-formated-csv
* Merge pull request #130 from kunder-lab/develop-bro2655-banners-restructuring
* purple-dark
* add searchRutIncollection method and add search rut to datacard users
* Fix
* Merge qa
* Merge pull request #129 from kunder-lab/develop-bro2700-reissue-campaigns
* Reissue campaign
* Welcome campaign minor fixes
* refactor formatrutCsvData method
* Welcome campaign fixes
* Av sav sim campaigns
* Av sav campaigns
* add format ruts csv data
* Slider amount, quota and consumer parameters
* Merge pull request #128 from kunder-lab/develop-bro2587-credit-campaigns
* Minor fixs
* Credit campaign on slider and avsav
* Merge pull request #127 from kunder-lab/hotfix-set-campaign-documents
* Prevent cards object from being modified
* update npmrc bit token
* Update bit components version
* change step id on cloudbuild
* update npmrc config
* log npmrc on cloudbuild
* lock file updated
* Merge pull request #120 from kunder-lab/feature-deploy
* Merge pull request #126 from kunder-lab/hotfix-login
* space
* removed switchMap
* Merge pull request #125 from kunder-lab/develop-bro2516-rut-upload-in-campaigns-engine
* Use arrayContains in campaigns uploads, and added a prograssbar
* Remove validation latam superviajes
* Merge pull request #124 from kunder-lab/fix-new-avsav-conflict
* close section tag
* fix conflict
* fix conflict
* fix conflict
* Merge pull request #119 from kunder-lab/develop-brk75-datacards-ruts
* Unused then and catch
* Fix admin version
* Add step id
* typo
* Node 10.10.0 on cloudbuild
* node version
* node version on cloud build
* Args
* Add encrypted npm registry config
* Add basic cloudbuild file without npm registry
* Minor fixes
* Minor fixes
* Data card users page
* Load users page
* Load data cards users component
* Merge pull request #118 from arturokunder/develop-campaignTotem
* solve conflict
* Merge pull request #117 from arturokunder/feature-angularUpdate
* switch to show campaign in the totem
* Remove hats
* Update angular version and fix some issues
* Merge pull request #116 from arturokunder/develop-fix-upload-ruts
* Update screen when update a welcome campaign
* Merge pull request #115 from arturokunder/develop-fix-upload-ruts
* Add error log and fix collection names
* Merge pull request #114 from arturokunder/develop-fix-upload-ruts
* Refactor rut upload button in campaign forms
* Merge pull request #113 from arturokunder/develop-fix-campaign-images-dimensions
* Merge branch 'qa' of github.com:arturokunder/ripley-banco-admin-beneficios into develop-fix-campaign-images-dimensions
* Add dimension description in image upload buttons
* Merge pull request #111 from arturokunder/develop-bro2430-upload-ruts-wp
* delete unused code
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into develop-bro2430-upload-ruts-wp
* handling error for uploads welcome campaings rut
* Goal type in slider campaigns form
* Merge branch 'qa' of github.com:arturokunder/ripley-banco-admin-beneficios into qa
* Merge pull request #112 from arturokunder/revert-101-feature-BRO2302-sliderCampaignGoalType
* Revert "[Feature][BRO-2302] Slider campaign goal type"
* Merge branch 'qa' of github.com:arturokunder/ripley-banco-admin-beneficios into qa
* hotfix in control name for campaigns dashboard
* Merge pull request #101 from arturokunder/feature-BRO2302-sliderCampaignGoalType
* hotfix in control name for campaigns dashboard
* error handling for uploads rut slider
* Merge branch 'qa' into feature-BRO2302-sliderCampaignGoalType
* modify uploadRuts method for campaigns and add upload ruts to welcome campaigns
* Merge pull request #110 from arturokunder/hotfix-remove-visualize-button
* Remove visualize button
* Merge pull request #108 from arturokunder/develop-bro2388-slow-month-change
* Merge pull request #109 from arturokunder/develop-BRO2380-banner-RP
* delete dashboard-banner.spec
* resolve conflicts
* resolve conflicts
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into develop-BRO2380-banner-RP
* Merge pull request #107 from arturokunder/develop-bro2376-download-buttons
* add benefit and category input/select and modifications y styles
* Use the already downloaded benefits code to update and don't reload the page
* Add download buttons to campaigns and fix bugs
* add new component for edit dashboard ripley points banner
* Add button to download views (test)
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into qa
* Remove log
* Merge pull request #106 from arturokunder/develop-bro2004-new-minime
* Merge with qa
* Minime banner page, minor fixes, 2 new redirections, and delete old campaign admin
* Merge pull request #105 from arturokunder/develop-BRO2339-upload-productCodes
* Merge pull request #104 from arturokunder/develop-bro2327-dap-redirection
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into qa
* package
* Minor fixes
* Fixed productCodes query. Minor refactors
* Update redirection
* Dap redirection
* Merge branch 'qa' of github.com:arturokunder/ripley-banco-admin-beneficios into develop-bro2004-new-minime
* Merge pull request #103 from arturokunder/hotfix-border-avsav-banner
* enable border input in avsav campaigns
* Merge branch 'qa' of github.com:arturokunder/ripley-banco-admin-beneficios into develop-bro2004-new-minime
* Merge pull request #102 from arturokunder/hotfix-buttons-avsav-sim
* copy and edit button in avsav simulations campaigns list
* Added new welcome campaign page
* add new value goal type to slider campaigns
* Merge pull request #100 from arturokunder/develop-bro2153-new-avsav-sim-banner
* Remove duplicated line
* Change type name
* Button to add new avsav simulation campaign
* Add new avsav simulation banner page
* Merge pull request #95 from arturokunder/develop-list-slider-campaigns
* uncomment validators for border color
* Merge pull request #99 from arturokunder/hotfix-admin-camapign
* remove admin campaign html button
* Merge with qa
* fixes from pr
* Add and copy avsav campaigns
* Merge pull request #92 from arturokunder/feature-BRO2160-unemploymentInsurance
* Merge branch 'qa' into feature-BRO2160-unemploymentInsurance
* Merge pull request #97 from arturokunder/develop-bro-2166
* add rut
* loading spinner
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into develop-bro-2166
* del console.log
* fix uploadCampaignBatch
* Add avsav campaign form
* fix format errors
* Merge pull request #98 from arturokunder/fix-upload-ruts
* add validator to empty line yn csv
* Merge pull request #94 from arturokunder/develop-upload-image-category
* delete unnecessary file
* small change input text html
* clear console.log
* minor fixes
* change variable type
* upload campaign users new structure
* upload ruts to campaigns
* Added new campaigns dashboard
* Improve category tips and instructions form
* Merge pull request #93 from arturokunder/develop-create-slider-campaign
* Merge pull request #91 from arturokunder/DEVELOP-BRO-2003-percentage-use-campaigns
* create variable percentage for views and goals
* Typo
* Resolve conflicts
* Form to create/edit slider campaigns
* parse date correctly on unemployment insurance file
* Added download unemployment insurance page
* Minor fix
* percentage admin-campaign
* Merge pull request #89 from arturokunder/develop-bro-2003
* Merge branch 'develop-mejoras-admin' of github.com:arturokunder/ripley-banco-admin-beneficios into develop-create-slider-campaign
* Added create slider campaign page
* Change modal message
* Merge branch 'qa' of github.com:arturokunder/ripley-banco-admin-beneficios into develop-mejoras-admin
* Copy categories and fixes in forms
* Merge branch 'develop-bro-2003' of https://github.com/arturokunder/ripley-banco-admin-beneficios into develop-bro-2003
* await querys firebase
* Update admin-campaign.component.html
* Merge pull request #90 from arturokunder/develop-BRO2101-carga-ruts-codigos
* resolve conflicts with qa
* truncate percCodesCommited with 2 decimals, change file path format and resolve lint
* Merge branch 'qa' into develop-bro-2003
* update html component
* create updateBenefitsInformation to update data about one specifict benefit
* change download icon
* download campaign icon
* download xlsx camapaign info
* download xlsx camapaign info
* delete console.log
* refactor to batch doc
* create uploadBenefitcsBatch
* Merge pull request #88 from arturokunder/develop-BRO1994-data-overwrite
* Refactored data assignment
* Added subscription chip
* Replaced function calls
* Added listener to update views when Firebase data is updated
* Merge pull request #87 from arturokunder/hotfix-xlsx-dependency
* Added missing dependency
* Merge pull request #86 from arturokunder/fix-access
* fix
* Merge pull request #85 from arturokunder/add-access-dataSubs
* add access to download-benefit-subscriptions to not admin users
* Merge pull request #84 from arturokunder/fix-query-clicks
* query segmentation of clicks campaigns
* Merge pull request #83 from arturokunder/feature-fix-BRO1570
* add title to section data clicks
* add filter for campaing in download clicks campaigns
* fixs
* Merge pull request #82 from arturokunder/develop-BRO1570
* little fixs, add download clicks campaigns user
* change restricction to admin user for create products of categories (latam-superviajes) to create new product
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into develop-BRO1570
* add modal for productCodes, download benefit subscriptions
* add export service - subscriptions component
* search added to products and categories dashboard and admin user validation for create redeems of some categories
* Merge pull request #81 from arturokunder/hotfix-field-length
* Fixed field length validation
* add user admin validation for categories latam and superviajes when a new redeem is added
* deleted Number function to password and productFolio variables
* bump version 1.2.1
* Merge pull request #80 from arturokunder/feature-little-changes
* fix
* little fix
* fix update product
* add code column to user transactions
* fix create category and update category
* clean load archive tac product
* changes in product and categories
* Merge pull request #78 from arturokunder/feature-exchanges
* bump version v1.2.0
* Merge branch 'feature-modify-products' into feature-exchanges
* Merge branch 'qa' into feature-exchanges
* modify termsAndConditions function
* automatic assignment of firebase url file(terms and conditions)
* Removed credentials
* add button to cleanProduc function
* fix create product with button null
* add new atributes and upload TaC in create new product
* Fix styles
* Manejo del modal al crear y actualizar en modulo del producto
* Manejo del modal al crear y actualizar
* Se agrega manejo para creacion y listado
* Se agrega listado de productos
* Se agrega lista y modificación de categoria
* Se reestructura parte de canjes y se agrega vista de listado
* Merge pull request #77 from arturokunder/feature-fix-origin-redeem
* change origin atribute in productTransaction
* Merge pull request #76 from arturokunder/feature-modify-category
* add examples inputs
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-modify-category
* Merge pull request #75 from arturokunder/hotfix-deleteInfoInBenefit
* add form validators
* date input modify
* add inputs in form (front)
* add atributes to model category
* Se agregan nuevos campos y se activa merge
* Merge pull request #74 from arturokunder/develop-bro1002-epu-push
* Minor fix
* App enabled always active
* Added pwa and app platforms
* Merge pull request #72 from arturokunder/hotfix-campaigns-required-fields
* Merge branch 'qa' of https://github.com/arturokunder/ripley-banco-admin-beneficios into hotfix-campaigns-required-fields
* Merge pull request #73 from arturokunder/feature-fix-balance
* fix
* fix balance service
* Fields redirectType and redirectPath aren't obligatory anymore. Fixed issue loading campaigns missing the expirationDate field. Fixed merge error.
* Deleted css epu push
* Merge pull request #71 from arturokunder/feature-balance-giftcard
* Merge branch 'qa' into feature-balance-giftcard
* Merge pull request #70 from arturokunder/feature-epu-push
* fix
* Merge pull request #69 from arturokunder/feature-changes-in-redeem
* Merge pull request #68 from arturokunder/develop-BRO-458-push-tray
* fix
* User field in report collection
* fix functions
* Epu Push by due date and digits
* Send epu notification by due date
* fix function
* fixed getBalance service - add getBalanceFunction - add modal for show the balance
* fix
* fixed function getBalanceGiftcard
* add part of service get Balance
* fix productTransaction model
* fix generateProductTransactionData method
* add productFolio condition
* Added image upload functionality
* Added redirectType, redirectPath and expirationDate fields to the campaign form
* add two columns to modal of redeem page
* Fixed image storage bug
* Merge pull request #67 from arturokunder/develop-BR-327
* Merge pull request #58 from arturokunder/qa
* Fixed length input and status
* Merge branch 'qa' into develop-BR-327
* Added functionality to send test notifications before uploading a rut file
* Added time to scheduled push in the main menu
* Merge pull request #65 from arturokunder/develop-211
* Merge pull request #64 from arturokunder/develop-208
* Merge pull request #66 from arturokunder/hotfix-push-user
* Fixed default checkbox when creating a new campaign
* Added separated permissions for push campaigns and push on/off menu
* Modified handling of notification view checkboxes
* Added form group validation to checkboxes, so at least one of them has to be checked in order to save a campaign.
* Fixed error in css
* Fixed campaign saving bug
* Add a pattern and remove blocked keys to rut input
* Added fields to log the last user that modified a campaign. Minor refactors
* Fixed local campaign variable not being assigned, which in turn fixes the logic associated with it. Confirmation modal now shows when uploading a file for a immediate campaign.
* Add description
* Fix upload in epu banner
* Use component to upload image in av/sav banner
* Added extra logic to show date field when editing a campaign
* Modified scheduled date field's logic to be shown/hidden. Also date value clears when switching to immediate or draft push types
* Fixed style error in campaigns views. Default checked channel to send is App only now
* versioning
* Merge pull request #59 from arturokunder/feature_notifications_phase_1
* Fixed comments in pr
* Fix min width
* Fixed elements
* Fixed permissions
* Merge branch 'qa' into feature_notifications_phase_1
* Fixed style and text
* Merge pull request #63 from arturokunder/feature-nps-time-editable
* Fixed PR comments
* Merge branch 'qa' into feature_notifications_phase_1
* Added description to inhibition table
* Merge qa into feature-nps-time-editable
* Added modal and TimeoutTime view
* Merge pull request #62 from arturokunder/develop-258-download-codes-with-technical-date
* Add progress bar and disable button when download
* Added Nps Survey management
* Fixes in technical date input
* Merge pull request #61 from arturokunder/develop-BR-190-bancamovil
* Minor fixes
* Fix error in upload image page
* Disable button when form in invalid and remove unused code
* remove hat
* download product codes
* Added new dynamic url to map disposable codes
* Merge branch 'develop-256-technical-date-input' of github.com:arturokunder/ripley-banco-admin-beneficios into develop-258-download-codes-with-technical-date
* Add download codes page
* Merge pull request #60 from arturokunder/develop-256-technical-date-input
* Add technical expiration date in load product codes page
* Merge branch 'qa' into feature_notifications_phase_1
* Deleted console.log
* Changes in saving immediate 2.0
* Changes in saving immediate
* Changed logic of creating notification
* version
* Merge pull request #56 from arturokunder/develop-10-improveUploadCodes
* Merge pull request #52 from arturokunder/qa
* Merge pull request #57 from arturokunder/feature-notifications-module
* Delete import
* Merge branch 'qa' into feature-notifications-module
* Added sendMethods to createCampain and updateCampain
* Created ChekBox in campain
* Stock validation and send mail on upload codes
* disable
* open proper modal on success
* add codes
* validations
* Merge pull request #55 from arturokunder/feature-notifications-module
* some fixes
* Merge branch 'qa' into feature-notifications-module
* Fixed module to add, duplicate campaign with ruts
* Added upload of ruts
* add tag script
* version
* Merge pull request #54 from arturokunder/develop-MCR600
* Merge branch 'qa' into develop-MCR600
* Merge pull request #53 from arturokunder/feature-749-createProductCategory
* minor fix
* Merge pull request #32 from arturokunder/feature-upload-banner
* hide campaign section
* load codes v1
* Changed url prod
* v1 of create product category
* Added datetime picker
* disabled select options
* Added difference in list
* Added environmetPath
* Added endpoint
* Wip on/off
* WIP on/off
* Added httpClient
* Added logic for delete, create and duplicate campaigns
* Fixed html
* Added module of push notifications
* Merge pull request #51 from arturokunder/feature-845-newAssignProductProcess
* Merge branch 'qa' into feature-845-newAssignProductProcess
* Merge pull request #50 from arturokunder/hotfix-benefitNewProp
* version
* token and origin props on transaction
* added period type, new versin
* Merge pull request #49 from arturokunder/feature-811-benefitCodesNewConditions
* new version
* remove required field
* minor change
* add new benefit codes conditions
* advance load codes
* advance upload codes
* Merge pull request #48 from arturokunder/develop-MCR742
* fix date sort
* minor changes
* minor change
* map status text
* fix datatable sort bug
* filter producs if active
* update package.json
* minor change
* fix auth bug
* Merge pull request #47 from arturokunder/feature-MCR744
* auris number required
* versioning :bookmark:
* Merge pull request #46 from arturokunder/feature-MCR746
* set admin info on assign product and minor visual fix
* Merge pull request #45 from arturokunder/feature-MCR747
* restrict access to benefits
* Merge pull request #44 from arturokunder/feature-MCR743
* get user redeem transactions
* Merge pull request #43 from arturokunder/qa
* Merge pull request #42 from arturokunder/hotfix-loading-promo
* fix promotion data properly
* Merge pull request #41 from arturokunder/qa
* Merge pull request #40 from arturokunder/develop-MCR704
* remove extra semicolon :sweat_smile:
* merge
* :bookmark: version 1.0.7
* Merge branch 'qa' into develop-MCR704
* new module av sav promotion configuration
* Merge pull request #39 from arturokunder/develop-MCR700
* Minor changes
* Page to change periods of benefit codes
* pay banner config
* Button in benefit table to edit period
* Merge pull request #37 from arturokunder/qa
* Merge pull request #38 from arturokunder/develop-MCR-699
* Restore deleted code, and use merge to update benefit type
* Add order field
* update benefits section titles
* Merge pull request #36 from arturokunder/feature-MCR690
* :bookmark: bump 1.0.6
* auth guard validation
* Merge pull request #35 from arturokunder/qa
* :bookmark: Release 1.0.5
* Merge pull request #33 from arturokunder/develop-MCR657
* merge with qa
* Merge pull request #34 from arturokunder/feature-regionals
* Remove a hat in package.json
* Add tab for regional benefits
* Add regional category to benefit creation page
* pwa small image
* Merge pull request #30 from arturokunder/develop-MCR546
* :bookmark: Update version 1.0.5
* Confirm campaign ID before creating it
* translate labels
* Add fields to campaign form and add features to upload button component
* new campaign form (incomplete)
* Componetize upload file button
* Componetize upload-file-button (incomplete)
* Merge pull request #31 from arturokunder/feature-MCR602
* Fix transaction function and minor changes
* Add spec file
* Error managment
* Spread CSV in sections of 500
* Upload codes from CSV with ruts
* added template
* Merge pull request #29 from arturokunder/feature-MCR565
* multi functional benefit button config
* typo
* added dynamic url and associate property
* removed unnecessary inputs from beauty and fitness fans benefit type
* user access
* user type access control
* added icon
* updated menu
* Merge branch 'hotfix-load-product' into feature-MCR550
* load files, admin type restrictions
* enable load product
* load product manually enable from menu
* Merge pull request #28 from arturokunder/develop-MCR504
* Merge pull request #27 from arturokunder/feature-MCR515
* Some fixes
* restrict characters in userId input (fix)
* restrict characters in userId input
* little fix in scss
* sticky position of product viewer in new-product page
* dropdown menu in main header
* format rut, dates logic in product viewer, and fixes is product object creation
* Merge pull request #25 from arturokunder/feature-MCR504
* format userId
* added phone product viewer to forms (static date)
* required inputs and other fixes
* dont allow E key in number inputs
* form working
* form created
* Merge branch 'feature-MCR504' of github.com:arturokunder/ripley-banco-admin-beneficios into feature-MCR515
* fixes
* new product files
* new folder
* display product images
* Fix in titles display
* Add productTransactions, working
* productTransaction form working with firebase
* load products and categories from firebase and display them
* Merge pull request #22 from arturokunder/develop-MCR205
* Merge pull request #21 from arturokunder/feature-MCR205
* Error messages changed
* Merge pull request #20 from arturokunder/feature-MCR205
* Validate columns csv
* Merge pull request #19 from arturokunder/feature-MCR205
* More validation in upload benefit codes and ruts
* Merge pull request #17 from arturokunder/feature-MCR205
* Variables name changed
* Upload improvements
* validations radio buttons
* MastercardRequired field and form fix
* Search in all tabs fixed
* Minor fix
* Benefit Ruts upload and codes radiobuttons
* Merge pull request #15 from arturokunder/feature-MCR209
* Change variable name
* Merge
* Clean code
* Benefits codes upload fixes
* Merge pull request #14 from arturokunder/feature-MCR196
* Benefit save codeUrl
* Added different status for personal
* Advance in csv upload
* Merge pull request #13 from arturokunder/feature-MCR196-personal-benefits
* Merge branch 'master' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-MCR196-personal-benefits
* Added necesary attributes for benefit modal.
* Delete fixed
* Merge
* Added new types of benefits
* Added gold title.
* Removed validations.
* Added link text.
* Advances
* Added variables.
* Added gold texts.
* Added copy functionality.
* Fixes.
* Added search keyword, and terms and conditions.
* Minor fix.
* Added new variable for list view.
* Added restofans
* Added share text.
* Added semi colon.
* Fix.
* Added every day.
* Style fix.
* Fixes
* Merge pull request #12 from arturokunder/develop-BEAB
* Changed production variables.
* Merge branch 'master' of https://github.com/arturokunder/ripley-banco-admin-beneficios into develop-BEAB
* Fix for styles.
* Merge pull request #11 from arturokunder/develop-BEAB
* Css fixes.
* Deleted unwanted folder.
* Minor fixes.
* Ignored firebase folder.
* Merge pull request #5 from arturokunder/feature-BEAB-benefit-creation-mobile-design
* style spinner loading images
* Added spinner when user is uploading file.
* Added missing key on object.
* Merge pull request #10 from arturokunder/feature-BEAB-modals-messages-design
* fix name class box buttons
* fix space buttons modal pull request
* Rollback on if statements for benefit list.
* fix detail empty message
* Added empty benefits message. TODO: change conditions on ngIf
* added empty message
* style modals and added favicon
* Merge pull request #9 from arturokunder/feature-BEAB-modals-messages
* Merge branch 'feature-BEAB-modals-messages-design' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-modals-messages-design
* Added html and class for modal title.
* fix styles
* Merge branch 'feature-BEAB-modals-messages' into feature-BEAB-modals-messages-design
* Styles modals wip
* Added false statements on catch flow.
* Added flow for new benefit from modal.
* Added modals on button actions.
* Added modal service and apply on goback of benefit creation step one.
* fix detail css home
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-benefit-creation-mobile-design
* Added disabled on buttons when user not complete benefit creation first and second steps.
* Merge remote-tracking branch 'origin/feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-benefit-creation-mobile-design
* corrections style tabs
* Merge pull request #8 from arturokunder/feature-BEAB-benefit-search
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-benefit-search
* Merge remote-tracking branch 'origin/feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-benefit-creation-mobile-design
* fix buttons upload images
* Added filter on benefit list.
* Deploy de firebase.
* Fixes for prod build.
* Merge pull request #7 from arturokunder/feature-BEAB-file-storage
* Mergin fixes.
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-file-storage
* change name class
* PR corrections.
* Merge remote-tracking branch 'origin/feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-benefit-creation-mobile-design
* fix style pull request
* Fix is modifiying.
* Added disable when user is saving or publishing benefit.
* Setted length of haderTitle to 30 and deleted Beneficio from headerText on viewer component.
* Added header title to create benefit fist step.
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-file-storage
* Added null data to keys that need to be empty.
* Added conditios to disable buttons when user is uploading files.
* Added uploadFileFunction to upload files on firebaseStorage.
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-benefit-creation-mobile-design
* Added a few fixes.
* fix error image mobile
* add input title benefit
* Added authenticated.
* corrections to radio buttons and add propieties to text with ellipsis
* style text error login
* Merge pull request #6 from arturokunder/feature-BEAB-auth
* Added error message.
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-auth
* fix problem header
* Merge branch 'feature-BEAB-benefit-creation' into feature-BEAB-benefit-creation-mobile-design
* Refactor to generate objecto to update or store on firebase.
* Correction on hml element.
* Merge branch 'feature-BEAB-benefit-creation' into feature-BEAB-benefit-creation-mobile-design
* Added functionality for edit, add and publish benefit.
* Added login and routes.
* Merge remote-tracking branch 'origin/feature-BEAB-benefit-creation-mobile-design' into feature-BEAB-benefit-creation-mobile-design
* wip home and fix header
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-benefit-creation-mobile-design
* Longer texts.
* Added correct form value.
* Merge branch 'feature-BEAB-benefit-creation' into feature-BEAB-benefit-creation-mobile-design
* Added validatos and flag to show and hide weekdays/months and conditios file.
* Added type of data on getFirebaseCollection.
* Added utils class and refactor for months and weekdays.
* Refactor of firebaseService and benefitsService.
* wip login
* Merge branch 'feature-BEAB-benefit-creation-mobile-design' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-benefit-creation-mobile-design
* fix error firefox radio button and add bar phone
* Merge branch 'feature-BEAB-benefit-creation' into feature-BEAB-benefit-creation-mobile-design
* wip corrections css others views and view mobile
* Added form to validate data on first step.
* wip view mobile preview
* Merge pull request #2 from arturokunder/feature-BEAB-home-design
* Added benefit-creation service, to handle benefit object.
* wip view preview mobile
* Added case when data on benefit to create is empty.
* Merge branch 'feature-BEAB-benefit-creation' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-benefit-creation
* Se eliminan eventos desde la vista.
* Merge pull request #4 from arturokunder/feature-BEAB-benefit-creation-design
* corrections pull request v4
* corrections pull request v3
* correctiones pull request v2
* Added benefit creation viewer component.
* corrections pull request
* Wip delete code css step one and step two
* wip view creation benefits two view
* wip view creation benefit
* Merge branch 'feature-BEAB-home-design' into feature-BEAB-benefit-creation
* I solve pull request (design)
* fix tag table
* setting in sass home, app, header
*  settings in sass
* Added component and view items for step 2.
* Added step two component for benefit creation.
* fix in table position
* Added datepiker and buttons for navigation.
* Correction on fonts and table view elements.
* Added fist view and components of create benefit.
* Merge remote-tracking branch 'origin/feature-BEAB-home-design' into feature-BEAB-home-design
* fix detail css colors
* Fixed error 404 on reload page on firebase deploy.
* Merge remote-tracking branch 'origin/feature-BEAB-home-design' into feature-BEAB-home-design
* fix colors
* Ortography corrections.
* Merge branch 'feature-BEAB-home-benefit-list' into feature-BEAB-home-design
* Added missing attribute on firebase object.
* Merge branch 'feature-BEAB-home-benefit-list' into feature-BEAB-home-design
* Added months and weekdays parsed.
* Deleted commented line.
* Updated package.json and readme.md
* Merge branch 'feature-BEAB-home-benefit-list' into feature-BEAB-home-design
* view ok
* Added data on new benefit and finished integration with firebase.
* wip advances view
* Merge branch 'feature-BEAB-home-benefit-list' into feature-BEAB-home-design
* Merge branch 'feature-BEAB-home-benefit-list' of https://github.com/arturokunder/ripley-banco-admin-beneficios into feature-BEAB-home-benefit-list
* Merge branch 'feature-BEAB-home-benefit-list' into feature-BEAB-home-design
* Added event in order input.
* Advances in table wip
* Merge pull request #1 from arturokunder/feature-BEAB-hostin
* advances in views wip
* Added loading when data is loading and added new benefit dummie.
* Added login for toggle and delete button.
* Readme update.
* Added necesary files for deploy.
* Added header and button add on homeview.
* Added weeklytab and list of benefits.
* Added monthly benefits list.
* Rearrange of folder project.
* Added folder structure to initiate the project.
* Changed css for scss.
* Added angular materials.
* Added configuration for firebase and fetch of data. Package.json and script for serve.
* Added base project and basic configuration of firebase.
* First commit
