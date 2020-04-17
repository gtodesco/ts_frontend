const mixinAlert = {
    methods: {

        async mxAlertConfirma() {
            const retorno = await this.$swal({
                icon: 'warning',
                title: '<strong style="font-family: Verdana, sans-serif">Tem certeza?</strong>',
                html: '<p style="font-family: Verdana, sans-serif">Deseja continuar?</p>',
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
        }

    }
}

export default mixinAlert;