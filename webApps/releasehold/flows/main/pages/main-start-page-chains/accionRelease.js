define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class accionRelease extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      if ($page.variables.ordenesSelec === undefined || $page.variables.ordenesSelec === null || $page.variables.ordenesSelec === '') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Debe seleccionar por lo menos una orden de la tabla.',
          type: 'warning',
          displayMode: 'transient',
        });
      } else {

        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.requestReleaseHold',
          ],
        });

         $page.variables.requestReleaseHold.correoNotificacion = document.getElementById("correoNotificacion").value;
         let ordenes = $page.variables.ordenesSelec;

         const myArrayOrdenes = ordenes.split(",");

         myArrayOrdenes.forEach(function(orden) 
         {
            const nodoOrden = $page.variables.listaOrdenesHoldVar.data.filter(function(elemento) {
                return elemento.Order === orden;
              });
            $page.variables.requestReleaseHold.ordenes.push({ numeroOrden: orden, sourceOrderNumber :  nodoOrden[0].sourceOrderNumber});
         });

        try {
          const callRestOicPostOUTLIBERAORDENEFACTURVENCID10LiberarOrdenesFacturaVencidaResult = await Actions.callRest(context, {
            endpoint: 'oic/postOUT_LIBERA_ORDENE_FACTUR_VENCID1_0LiberarOrdenesFacturaVencida',
            body: $page.variables.requestReleaseHold,
          });

           await Actions.fireNotificationEvent(context, {
             summary: 'Las ordenes han sido recibidas. Pronto recibirá un mail con el detalle del proceso. ',
             type: 'confirmation',
             displayMode: 'transient',
             message: document.getElementById("correoNotificacion").value,
           });

          await Actions.resetVariables(context, {
            variables: [
              '$page.variables.listaOrdenesHoldVar.data',
            ],
          });
        } catch (error) {
          await Actions.fireNotificationEvent(context, {
            displayMode: 'transient',
            summary: 'No se logro enviar las ordenes para el proceso de release.',
          });
           await Actions.resetVariables(context, {
            variables: [
              '$page.variables.listaOrdenesHoldVar.data',
            ],
          });
        }
      }


 
    }
  }

  return accionRelease;
});
