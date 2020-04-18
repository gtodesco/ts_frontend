const mixinAlert = {
    methods: {

        async mxAlertConfirma(mensagem) {
            const retorno = await this.$swal({
                icon: 'warning',
                title: '<strong style="font-family: Verdana, sans-serif">Atenção</strong>',
                html: '<p style="font-family: Verdana, sans-serif">' + mensagem + '</p>',
                showCancelButton: true,
                confirmButtonText: '<p style="font-family: Verdana, sans-serif">Sim</p>',
                confirmButtonColor: '#3085d6',
                cancelButtonText: '<p style="font-family: Verdana, sans-serif">Não</p>',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return true
                  }
            });

            return retorno.value ? retorno.value : false;
        },

        async mxAlertErro(mensagem) {
            const retorno = await this.$swal({
                icon: 'error',
                title: '<strong style="font-family: Verdana, sans-serif">Ooops...</strong>',
                html: '<p style="font-family: Verdana, sans-serif">' + mensagem + '</p>',
                showCancelButton: false,
                confirmButtonText: '<p style="font-family: Verdana, sans-serif">OK</p>',
                confirmButtonColor: '#d33',
            });

            return retorno.value ? retorno.value : false;
        },

        async mxAlertErroInesperado() {
            const retorno = await this.$swal({
                icon: 'error',
                title: '<strong style="font-family: Verdana, sans-serif">x ERRO x</strong>',
                html: '<p style="font-family: Verdana, sans-serif">Ocorreu um erro inesperado.</p>',
                showCancelButton: false,
                confirmButtonText: '<p style="font-family: Verdana, sans-serif">OK</p>',
                confirmButtonColor: '#3085d6',
            });

            return retorno.value ? retorno.value : false;
        }

    }
}

export default mixinAlert;