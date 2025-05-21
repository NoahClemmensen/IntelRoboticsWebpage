$(document).ready(function () {
    $('#robotSearch').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        $('#robotTableBody tr').each(function () {
            const match = $(this).find('td').toArray().some(cell =>
                $(cell).text().toLowerCase().includes(searchValue)
            );
            $(this).toggle(match);
        });
    });
});