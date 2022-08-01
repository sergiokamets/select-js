const select = new Select('#select', {
    placeholder: 'Select element',
    data: [
        {id: '1', value: 'React'},
        {id: '2', value: 'Angular'},
        {id: '3', value: 'Vue'},
        {id: '4', value: 'React Native'},
        {id: '5', value: 'Next'},
        {id: '6', value: 'Nest'},
    ],
    selectedId: 'react',
    onSelect(item) {
        console.log(item);
    }
});