const mixinFuncoesGerais = {
    methods: {
        mxIrPara: function (rota) {
            this.$router.push('/' + rota);
        },
    }
}

export default mixinFuncoesGerais;