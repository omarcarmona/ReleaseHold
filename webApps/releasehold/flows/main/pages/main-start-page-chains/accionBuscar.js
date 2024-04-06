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

  class accionBuscar extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      if ($page.variables.bandSelectBU !== 'true') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Debe Seleccionar la Unidad de negocio.',
          type: 'warning',
          displayMode: 'transient',
        });
      } else {
        try {
                  await Actions.resetVariables(context, {
            variables: [
              '$page.variables.listaOrdenesHoldVar.data',
            ],
          });

           const resultadosConsulta = await Actions.callRest(context, {
             endpoint: 'oic/getCONSUL_ORDENE_HOLD_FACTUR_VENCID1_0GetOrdenesHoldUnidadNegocio',
             uriParams: {
               unidadNegocio: $page.variables.BU,
             },
           });

          if (resultadosConsulta.body.hasOwnProperty("OrdenesEnHold")) {

            $page.variables.listaOrdenesHoldVar.data = resultadosConsulta.body.OrdenesEnHold;
           
            await Actions.fireNotificationEvent(context, {
              summary: 'Total de ordenes consultadas',
              message: resultadosConsulta.body.OrdenesEnHold.length,
              type: 'confirmation',
              displayMode: 'transient',
            });
          } else {
            await Actions.fireNotificationEvent(context, {
              displayMode: 'transient',
              type: 'warning',
              summary: 'No hay ordenes en hold de factura vencida para la unidad de negocio seleccionada.',
            });
          }
        } catch (error) {
          await Actions.fireNotificationEvent(context, {
            type: 'error',
            summary: 'No se logro consultar Ordenes.',
            displayMode: 'transient',
          });
        }
      }

    }
  }

  return accionBuscar;
});
