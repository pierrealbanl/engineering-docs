module.exports = {
    adminSidebar: [
        'intro',
        {
            type: 'category',
            label: 'CPP',
            items: [
                'cpp/preambule',
                'cpp/concepts-avances-poo',
                'cpp/design-patterns'
            ]
        },
        {
            type: 'category',
            label: 'CSS',
            items: [
                'css/preambule',
                {
                    type: 'category',
                    label: '1. Mise en page',
                    items: [
                        'css/layout/flexbox'
                    ]
                },
            ]
        },
        {
            type: 'category',
            label: 'Boost Your English',
            items: [
                'boost-your-english/fondamentaux-grammaticaux',
                'boost-your-english/vocabulaire-expressions-utiles',
                'boost-your-english/smart-english-tips',
            ]
        }
    ],
}
