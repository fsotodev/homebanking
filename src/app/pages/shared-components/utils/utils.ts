export interface ModalDataObject {
  title: string;
  titleColor: string;
  desc: string;
  leftButton: string;
  rightButton: string;
  type?: string;
  params?: any;
}

export class Utils {

  public pathHomeCampaign = '/list-campaigns';

  private legibleTextFromNpsTag = {
    Accounting: 'Desplegar/Consultar Estado de cuenta (Pagos)',
    Av: 'Realizar un Avance (Venta)',
    CreditCardPaymentServipag: 'Pagar tarjeta con Servipag (Pagos)',
    CreditCardPaymentSightAccount: 'Pagar tarjeta con Cuenta Vista (Pagos)',
    Dap: 'Invertir DAP (Venta)',
    OnOff: 'Realizar On/off (Otros)',
    PAT: 'Suscribir un Pago de cuentas / PAT (Pagos)',
    PEC: 'Realizar un PEC (Pagos)',
    PersonalLoanPayment: 'Pagar cuota C. Consumo (Pagos)',
    Sav: 'Realizar un Súper Avance (Venta)',
    TEF: 'Transferencia a terceros (TEF)',
    TEFAdd: 'Crear destinatario (TEF)',
    UpdateUserInfo: 'Actualiza datos (Otros)'
  };

  private weekdays = {
    Lunes: 'Lun',
    Martes: 'Mar',
    Miércoles: 'Mie',
    Jueves: 'Jue',
    Viernes: 'Vie',
    Sábado: 'Sab',
    Domingo: 'Dom',
    'Todos los días': 'Todos los días'
  };
  private months = {
    Enero: 'Ene',
    Febrero: 'Feb',
    Marzo: 'Mar',
    Abril: 'Abr',
    Mayo: 'May',
    Junio: 'Jun',
    Julio: 'Jul',
    Agosto: 'Ago',
    Septiembre: 'Sep',
    Octubre: 'Oct',
    Noviembre: 'Nov',
    Diciembre: 'Dic',
  };

  private monthsFromNumber = {
    1: 'enero',
    2: 'febrero',
    3: 'marzo',
    4: 'abril',
    5: 'mayo',
    6: 'junio',
    7: 'julio',
    8: 'agosto',
    9: 'septiembre',
    10: 'octubre',
    11: 'noviembre',
    12: 'diciembre'
  };

  private modalDataObjects = {
    genericError: {
      title: 'Hubo un error, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: 'guardar',
      rightButton: 'reintentar'
    },
    uploadError: {
      title: 'Hubo un error con la subida del archivo, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'reintentar'
    },
    uploadErrorCampaign: {
      title: 'Archivo no tiene el mismo nombre que la <span class="text-highlight-modal">campaña</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'reintentar'
    },
    idUploadError: {
      title: 'El id del beneficio no corresponde, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'reintentar'
    },
    duplicatedBenefitCodeError: {
      title: 'Uno o más códigos ya fueron cargados anteriormente, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'reintentar'
    },
    columnUploadError: {
      title: 'La cantidad de columnas del csv no corresponde, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'reintentar'
    },
    rutBadFormat: {
      title: 'Error de formato',
      titleColor: 'warning',
      desc: '<strong>El archivo no cumple con el formato requerido.</strong><br/><br/>Recuerda:<br/><ul>\n' +
        '  <li>Validar formato del .CSV antes de subirlo.</li>\n' +
        '  <li>Incluir RUT completo con DV. Sin puntos y sin guión. Con k minúscula<br/>si aplica. Sin cabecera.</li>\n' +
        '</ul>',
      leftButton: '',
      rightButton: 'entendido'
    },
    csvUploadSuccess: {
      title: '¡Archivo cargado <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    csvUploadError: {
      title: 'Ocurrio un problema al cargar el archivo, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    csvFormatError: {
      title: 'Ocurrió un error validando el formato de tu archivo, por favor revisa las instrucciones.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    csvLimitError: {
      title: 'Hubo un error en la validación del archivo. Recuerda que no debe superar 1.000.0000 de ruts.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    firebasePermissionDenied: {
      title: 'Permisos insuficientes en Firebase, inténtalo <span class="text-highlight-modal">nuevamente</span>.',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    deleteConfirm: {
      title: '¿Seguro deseas eliminar este <span class="text-highlight-modal">beneficio</span>?',
      titleColor: 'warning',
      desc: 'Al eliminar perderás todos datos del beneficio.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    deleteConfirmProduct: {
      title: '¿Seguro deseas eliminar este <span class="text-highlight-modal">producto</span>?',
      titleColor: 'warning',
      desc: 'Al eliminarlo no podrás acceder al producto ni cargarle codigos.<br>' +
        'Sin embargo aún podrás descargar los codigos asociados a este producto.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    deleteTagConfirm: {
      title: '¿Seguro deseas eliminar este <span class="text-highlight-modal">Tag</span>?',
      titleColor: 'warning',
      desc: 'Al eliminar perderás todos datos del Tag.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    deleteConfirmDatacardUser: {
      title: '¿Seguro deseas eliminar este <span class="text-highlight-modal">usuario</span>?',
      titleColor: 'warning',
      desc: 'Al eliminar perderás los datos de este usuario.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    sendEpuPushConfirm: {
      title: '¿Seguro deseas enviar las push Epu del día seleccionado?',
      titleColor: 'warning',
      desc: '',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    sendedEpuPush: {
      title: 'Las notificaciones push de EPU se han comenzado a enviar',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    copyConfirm: {
      title: '¿Seguro deseas copiar este <span class="text-highlight-modal">beneficio</span>?',
      titleColor: 'warning',
      desc: 'Se duplicarán todos los detalles del beneficio.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    copyConfirmCategory: {
      title: '¿Seguro deseas copiar esta <span class="text-highlight-modal">categoría</span>?',
      titleColor: 'warning',
      desc: 'Se duplicarán todos los detalles de la categoría.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    copyConfirmCampaign: {
      title: '¿Seguro deseas copiar esta <span class="text-highlight-modal">campaña</span>?',
      titleColor: 'warning',
      desc: 'Se duplicarán todos los detalles de la campaña.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    changeScreenName: {
      title: 'Para continuar configurando la compaña, primero debes modificar el nombre de la pantalla (imagen):',
      titleColor: 'warning',
      desc: '',
      leftButton: 'Cancelar*',
      rightButton: 'Cambiar nombre'
    },
    copyConfirmScreen: {
      title: '¿Seguro deseas copiar esta <span class="text-highlight-modal">pantalla</span>?',
      titleColor: 'warning',
      desc: 'Se duplicarán todos los detalles de la pantalla.',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    deleteSuccess: {
      title: '¡Beneficio eliminado <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    saveSuccess: {
      title: '¡Beneficio guardado <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'nuevo beneficio',
      rightButton: 'ir al inicio'
    },
    saveSuccessTransaction: {
      title: 'Transacción guardada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'nueva transacción',
      rightButton: 'ir al inicio'
    },
    updateSuccessBenefitTypes: {
      title: 'Tipos de beneficios actualizados <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'seguir editando',
      rightButton: 'ir al inicio'
    },
    updateSuccessBenefitCodesPeriod: {
      title: 'Periods de códigos actualizados <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'seguir editando',
      rightButton: 'ir al inicio'
    },
    saveSuccessProduct: {
      title: 'Producto creado <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'nuevo producto',
      rightButton: 'ir al inicio'
    },
    updateSuccessProduct: {
      title: 'Producto actualizado <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'nuevo producto',
      rightButton: 'ir al inicio'
    },
    updateSuccessCampaign: {
      title: 'Campaña actualizada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: 'nueva campaña',
      rightButton: 'ir al inicio'
    },
    saveSuccessCampaign: {
      title: 'Campaña creada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    saveSuccessBenefitScreen: {
      title: 'Pantalla de beneficios creada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: 'Recuerda que si deseas subir un rutero para este/os welcomepack, debes hacerlo en la pantalla de edición',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    updateSuccessBenefitScreen: {
      title: 'Pantalla de beneficios actualizada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    saveRipleyPointsScreen: {
      title: 'Pantalla de Ripley puntos creada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    updateRipleyPointsScreen: {
      title: 'Pantalla de Ripley puntos actualizada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    saveSuccessCardsWPScreen: {
      title: 'Pantalla de productos creada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    updateSuccessCardsWPScreen: {
      title: 'Pantalla de productos actualizada <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Ir al inicio'
    },
    publishSuccess: {
      title: '¡Beneficio publicado <span class="text-highlight-modal">exitosamente</span>¡',
      titleColor: 'normal',
      desc: '',
      leftButton: 'nuevo beneficio',
      rightButton: 'ir al inicio'
    },
    updateCancel: {
      title: '¿Seguro que deseas cancelar esta <span class="text-highlight-modal">operación?</span>',
      titleColor: 'warning',
      desc: 'Al cancelar perderás los datos ingresados anteriormente',
      leftButton: 'Sí, cancelar',
      rightButton: 'No, quedarme aquí'
    },
    confirmation: {
      title: '¿Seguro que deseas subir el <span class="text-highlight-modal">archivo?</span>',
      titleColor: 'warning',
      desc: '',
      leftButton: 'No',
      rightButton: 'Aceptar'
    },
    editUser: {
      title: 'Editar <span class="text-highlight-modal">Usuario</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'cancelar',
      rightButton: 'guardar',
      type: 'editUser'
    },
    createUser: {
      title: 'Nuevo <span class="text-highlight-modal">Usuario</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'cancelar',
      rightButton: 'crear',
      type: 'createUser'
    },
    saveSuccessBannerConfig: {
      title: 'Configuración <span class="text-highlight-modal">actualizada</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'aceptar',
      rightButton: 'ir al inicio',
    },
    saveSuccessAvSavPromoConfig: {
      title: 'Promoción <span class="text-highlight-modal">actualizada</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'aceptar',
      rightButton: 'ir al inicio',
    },
    modalTableTransactions: {
      title: 'Información de usuario - <span class="text-highlight-modal">Canjes</span>',
      titleColor: 'normal',
      desc: 'Canjes realizados por el usuario',
      rightButton: 'aceptar',
    },
    modalBalanceGiftcard: {
      title: 'Saldo <span class="text-highlight-modal">Giftcard</span>',
      titleColor: 'normal',
      desc: 'Su saldo es',
      rightButton: 'aceptar',
    },
    modalTableCodes: {
      title: 'Códigos de <span class="text-highlight-modal">productos</span>',
      titleColor: 'normal',
      desc: 'Códigos',
      rightButton: 'aceptar',
    },
    modalDataCardRecord: {
      title: 'Historial de <span class="text-highlight-modal">archivos cargados</span>',
      titleColor: 'normal',
      desc: 'Archivos',
      rightButton: 'aceptar',
    },
    saveSuccessCreateCampaign: {
      title: 'Ruts subidos <span class="text-highlight-modal">exitosamente</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Aceptar',
    },
    updateSuccessCreateCampaign: {
      title: 'Campaña actualizada <span class="text-highlight-modal">exitosamente</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'Aceptar',
      rightButton: 'Ir al inicio',
    },
    deleteConfirmCampaign: {
      title: '¿Seguro deseas eliminar esta <span class="text-highlight-modal">campaña</span>?',
      titleColor: 'warning',
      desc: 'Al eliminar perderás todos datos de la campaña.',
      leftButton: 'Cerrar',
      rightButton: 'Aceptar'
    },
    cancelConfirmCampaign: {
      title: '¿Seguro deseas cancelar en envío de esta <span class="text-highlight-modal">campaña</span>?',
      titleColor: 'warning',
      desc: 'Al cancelar se terminarán los envíos en cola.',
      leftButton: 'Cerrar',
      rightButton: 'Aceptar'
    },
    editCampaign: {
      title: '¿Desea editar esta <span class="text-highlight-modal">campaña</span>?',
      titleColor: 'normal',
      desc: 'Puedes editar la campaña.',
      leftButton: 'En otro momento',
      rightButton: 'Editar'
    },
    updateConfiguration: {
      title: 'Configuración actualizada <span class="text-highlight-modal">exitosamente</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'Aceptar',
      rightButton: 'Ir al inicio',
    },
    newCampaign: {
      title: '¿Desea agregar ruts a esta <span class="text-highlight-modal">campaña</span>?' +
            'Recuerda que se debe ejecutar el envío de prueba antes de poder subir el archivo',
      titleColor: 'normal',
      // eslint-disable-next-line max-len
      desc: '',
      leftButton: 'En otro momento',
      rightButton: 'Agregar'
    },
    newPromotionalBanner: {
      title: '¿Desea actualizar los campos de este <span class="text-highlight-modal">Banner</span>?',
      titleColor: 'normal',
      // eslint-disable-next-line max-len
      desc: '',
      leftButton: 'Cancelar',
      rightButton: 'Aceptar'
    },
    uploadCodesSuccess: {
      title: 'Códigos cargados con <span class="text-highlight-modal">éxito</span>',
      titleColor: 'normal',
      desc: '',
      rightButton: 'cargar de nuevo',
      leftButton: 'ir al inicio'
    },
    saveSuccessCategory: {
      title: 'Categoría <span class="text-highlight-modal">creada</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'aceptar',
      rightButton: 'ir a categorías',
    },
    updateSuccessCategory: {
      title: 'Categoría <span class="text-highlight-modal">actualizada</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'aceptar',
      rightButton: 'ir a categorías',
    },
    inmediateCampaign: {
      title: '¿Esta seguro que quiere enviar esta campaña <span class="text-highlight-modal">inmediatamente</span>?',
      titleColor: 'normal',
      // eslint-disable-next-line max-len
      desc: '',
      leftButton: 'No',
      rightButton: 'Si',
    },
    duplicatedCodeError: {
      title: 'Códigos no válidos',
      titleColor: 'normal',
      desc: 'Uno o mas códigos en el archivo ya existen en transacciones.',
      leftButton: 'volver a intentar',
      rightButton: 'ir al inicio',
    },
    saveNpsInhibitionTimeSuccess: {
      title: 'Tiempo de Inhibición de flujo NPS guardado con éxito',
      titleColor: 'normal',
      desc: '',
      leftButton: 'Aceptar',
      rightButton: 'Ir al inicio'
    },
    saveNpsTimeoutTimeSuccess: {
      title: 'Tiempo de Timeout de flujo NPS guardado con éxito',
      titleColor: 'normal',
      desc: '',
      leftButton: 'Aceptar',
      rightButton: 'Ir al inicio'
    },
    successSearchRut: {
      title: 'El rut se encuentra cargado',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Aceptar'
    },
    errorSearchRut: {
      title: 'El rut no se encuentra cargado',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'Aceptar'
    },
    confirmDeleteConfigUpload: {
      title: '¿Estás seguro que deseas eliminar la configuración?',
      titleColor: 'normal',
      desc: '',
      leftButton: 'Cancelar',
      rightButton: 'Aceptar'
    },
    loginDigitsConfirm: {
      title: '¿Seguro desea cambiar los dígitos verificadores?',
      titleColor: 'warning',
      desc: '',
      leftButton: 'cerrar',
      rightButton: 'aceptar'
    },
    updateSuccessLoginDigits: {
      title: 'Dígitos <span class="text-highlight-modal">actualizados</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'aceptar',
      rightButton: 'ir al home',
    },
    disableDigitsConfirm: {
      title: '¿Seguro desea quitar todos los dígitos verificadores (Android, IOS, Desktop)?',
      titleColor: 'warning',
      desc: '',
      leftButton: 'cerrar',
      rightButton: 'aceptar',
    },
    platformsConfirm: {
      title: '¿Seguro desea cambiar la configuración de login (Esto podría afectar la cantidad de logins correctos)?',
      titleColor: 'warning',
      desc: '',
      leftButton: 'cerrar',
      rightButton: 'aceptar',
    },
    updateSuccessConfigLogin: {
      title: 'Configuración <span class="text-highlight-modal">actualizada</span>',
      titleColor: 'normal',
      desc: '',
      leftButton: 'aceptar',
      rightButton: 'ir al home',
    },
    updateEmbeddedLoginConfig: {
      title: 'Actualizar <span class="text-highlight-modal">configuración</span>',
      titleColor: 'normal',
      desc: '¿Seguro desea actualizar imágenes? Estos cambios se verán reflejados desde el próximo refresco del login embebido',
      leftButton: 'Cancelar',
      rightButton: 'Confirmar',
    },
    errorTypeCodeAssociate: {
      title: 'Códigos no válidos',
      titleColor: 'normal',
      desc: 'codigos subidos no corresponden con el tipo de codigo asociado al producto.',
      leftButton: 'volver a intentar',
      rightButton: 'ir al inicio',
    },
    errorTypeMaxLength: {
      title: 'Códigos no válidos',
      titleColor: 'normal',
      desc: 'error, solo se acepta un maximo de 19 caracteres en la celda codigo o clave.',
      leftButton: 'volver a intentar',
      rightButton: 'ir al inicio',
    },
    errorTypeMinLength: {
      title: 'Códigos no válidos',
      titleColor: 'normal',
      desc: 'error, existen celdas vacias dentro del archivo.',
      leftButton: 'volver a intentar',
      rightButton: 'ir al inicio',
    },
    codeReportGenerated: {
      title: 'Solicitud registrada',
      titleColor: 'normal',
      desc: 'Se ha generado su solicitud, por favor espere a recibir el archivo en su correo corporativo.<br />' +
       '(Tiempo máximo de procesamiento: 10 minutos)',
      leftButton: '',
      rightButton: 'Aceptar',
    },
    csvUploadFileSuccess: {
      title: '¡Archivo subido <span class="text-highlight-modal">exitosamente</span>!',
      titleColor: 'normal',
      desc: '',
      leftButton: '',
      rightButton: 'aceptar'
    },
    validationError: {
      title: 'Existen campos que no cumplen con las validaciones',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'Entendido'
    },
    categoryTypeError: {
      title: 'Código de categoría ya existe, por favor cambie el código y vuelva a intentarlo',
      titleColor: 'warning',
      desc: '',
      leftButton: '',
      rightButton: 'Entendido'
    }
  };

  public constructor() { }

  public getShortWeekdayString(weekday: string): string {
    return this.weekdays[weekday];
  }

  public getLegibleTextNpsString(npsTag: string): string {
    return this.legibleTextFromNpsTag[npsTag];
  }

  public getShortMonthString(month: string): string {
    return this.months[month];
  }

  public getMonthStringFromNumber(month: number): string {
    return this.monthsFromNumber[month];
  }

  public getModalDataObject(modalType: string): ModalDataObject {
    return this.modalDataObjects[modalType];
  }

  public getScssUrl(url: string) {
    if (url) {
      return 'url(\'' + url.trim() + '\')';
    }
    return 'url(undefined)';
  }

  public completeCampaing(thisOriginal: any, thisCampaing: any) {
    const original = Object.keys(thisOriginal);
    const campana = Object.keys(thisCampaing);
    original.forEach(claveOriginal => {
      const encontrado = campana.find((claveCampana) => claveOriginal === claveCampana);
      if (!encontrado) {
        thisCampaing[claveOriginal] = thisOriginal[claveOriginal];
      } else {
        if ( typeof thisCampaing[claveOriginal] !== 'string' &&  Object.keys(thisOriginal[claveOriginal]).length > 0) {
          const subOriginal = Object.keys(thisOriginal[claveOriginal]);
          const subCampana = Object.keys(thisCampaing[claveOriginal]);
          subOriginal.forEach(claveSubOriginal => {
            const subEncontrado = subCampana.find((subClaveCampana) => claveSubOriginal === subClaveCampana);
            if (!subEncontrado) {
              thisCampaing[claveOriginal][claveSubOriginal]= thisOriginal[claveOriginal][claveSubOriginal];
            }
          });
        }
      }
    });
    return thisCampaing;
  }
}
