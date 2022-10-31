export const getIconClasses = (
    shouldLightIcon: boolean,
) => {
    let iconClasses = 'icon';

    if ( shouldLightIcon ) {
        iconClasses += ' light';
    }

    return iconClasses;
}