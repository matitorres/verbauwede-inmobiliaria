$(function () {
    $("#inputPropertyPhoto").on('change', function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    })

    $("#inputPropertyPhotos").change(function () {
        if (this.files.length > 10) {
            alert('Puede seleccionar un máximo de 10 fotos secundarias')
            $("#labelInputPropertyPhotos").text("Máximo de fotos excedido")
            $('#property-add-submit').attr("disabled", true);
        } else {
            $("#labelInputPropertyPhotos").text(this.files.length + " archivos seleccionados")
            $('#property-add-submit').attr("disabled", false);
        }
    });

    $("#contact-form-link").on('click', function (event) {
        if (this.hash !== "") {
            console.log(event)
            event.preventDefault();

            const hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 1000, function () {
                window.location.hash = hash;
                //$(hash).effect( "shake", { times: 1, distance: 5 }, 200 )
                $('#name-contact-form-footer')
                    .effect("shake", { times: 2, distance: 4 }, 300)
                $('#phone-contact-form-footer')
                    .effect("shake", { direction: 'right', times: 1, distance: 2 }, 300)
                $('#mail-contact-form-footer')
                    .effect("shake", { times: 2, distance: 2 }, 300)
                $('#msg-contact-form-footer')
                    .effect("shake", { direction: 'right', times: 2, distance: 4 }, 300)
            });

        }
    });

    // SEARCH BAR
    let searchOperation = $("#search-operation")
    let btnOperationOne = $("#btn-operation-1")
    let btnOperationTwo = $("#btn-operation-2")
    let btnOperationThree = $("#btn-operation-3")
    let refreshOperation = $("#refresh-operation")
    btnOperationOne.click(() => {
        $(".filter-operation .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchOperation.prop('value', btnOperationOne.text().trim())
        btnOperationOne.addClass('bg-gradient-custom-primary text-white')
    })
    btnOperationTwo.click(() => {
        $(".filter-operation .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchOperation.prop('value', btnOperationTwo.text().trim())
        btnOperationTwo.addClass('bg-gradient-custom-primary text-white')
    })
    btnOperationThree.click(() => {
        $(".filter-operation .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchOperation.prop('value', btnOperationThree.text().trim())
        btnOperationThree.addClass('bg-gradient-custom-primary text-white')
    })
    refreshOperation.click(() => {
        $(".filter-operation .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchOperation.prop('value', '')
    })

    $("#refresh-type").click(() => {
        $("#input-type").prop('value', '')
    })

    $("#refresh-province").click(() => {
        $("#input-province").prop('value', '')
    })

    $("#refresh-city").click(() => {
        $("#input-city").prop('value', '')
    })

    let searchBedrooms = $("#search-bedrooms")
    let searchBedroomsExact = $("#search-bedrooms-exact")
    let btnBedroomsOne = $("#btn-bedrooms-1")
    let btnBedroomsTwo = $("#btn-bedrooms-2")
    let btnBedroomsThree = $("#btn-bedrooms-3")
    let btnBedroomsFour = $("#btn-bedrooms-4")
    let btnBedroomsFive = $("#btn-bedrooms-5")
    let switchBedrooms = $("#bedrooms-switch")
    let refreshBedrooms = $("#refresh-bedrooms")
    btnBedroomsOne.click(() => {
        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', btnBedroomsOne.text().trim())
        btnBedroomsOne.addClass('bg-gradient-custom-primary text-white')
    })
    btnBedroomsTwo.click(() => {
        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', btnBedroomsTwo.text().trim())
        btnBedroomsTwo.addClass('bg-gradient-custom-primary text-white')
    })
    btnBedroomsThree.click(() => {
        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', btnBedroomsThree.text().trim())
        btnBedroomsThree.addClass('bg-gradient-custom-primary text-white')
    })
    btnBedroomsFour.click(() => {
        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', btnBedroomsFour.text().trim())
        btnBedroomsFour.addClass('bg-gradient-custom-primary text-white')
    })
    btnBedroomsFive.click(() => {
        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', btnBedroomsFive.text().trim())
        btnBedroomsFive.addClass('bg-gradient-custom-primary text-white')
    })
    switchBedrooms.change(() => {
        if (switchBedrooms.is(':checked')) {
            btnBedroomsOne.text("1")
            btnBedroomsOne.css("padding", "0 12px")
            btnBedroomsTwo.text("2")
            btnBedroomsTwo.css("padding", "0 12px")
            btnBedroomsThree.text("3")
            btnBedroomsThree.css("padding", "0 12px")
            btnBedroomsFour.text("4")
            btnBedroomsFour.css("padding", "0 12px")
            if (searchBedrooms.prop('value') !== '' && searchBedrooms.prop('value') !== '5+') {
                searchBedrooms.prop('value', searchBedrooms.prop('value').replace('+', ''))
            }
        } else {
            btnBedroomsOne.text("1+")
            btnBedroomsOne.css("padding", "0 8px")
            btnBedroomsTwo.text("2+")
            btnBedroomsTwo.css("padding", "0 8px")
            btnBedroomsThree.text("3+")
            btnBedroomsThree.css("padding", "0 8px")
            btnBedroomsFour.text("4+")
            btnBedroomsFour.css("padding", "0 8px")
            if (searchBedrooms.prop('value') !== '' && searchBedrooms.prop('value') !== '5+') {
                searchBedrooms.prop('value', searchBedrooms.prop('value') + '+')
            }
        }
    })
    if (switchBedrooms.is(':checked')) {
        btnBedroomsOne.text("1")
        btnBedroomsOne.css("padding", "0 12px")
        btnBedroomsTwo.text("2")
        btnBedroomsTwo.css("padding", "0 12px")
        btnBedroomsThree.text("3")
        btnBedroomsThree.css("padding", "0 12px")
        btnBedroomsFour.text("4")
        btnBedroomsFour.css("padding", "0 12px")
        if (searchBedrooms.prop('value') !== '' && searchBedrooms.prop('value') !== '5+') {
            searchBedrooms.prop('value', searchBedrooms.prop('value').replace('+', ''))
        }
    }
    refreshBedrooms.click(() => {
        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', '')
        switchBedrooms.prop('checked', false)
        searchBedroomsExact.prop('value', '')
    })

    let searchPriceMin = $("#input-price-min")
    let searchPriceMax = $("#input-price-max")
    let searchIsDollar = $("#is-dollar")
    let refreshPrice = $("#refresh-price")
    let switchDollar = $("#dollar-switch")
    refreshPrice.click(() => {
        searchPriceMin.prop('value', '')
        searchPriceMax.prop('value', '')
        switchDollar.prop('checked', false)
        searchIsDollar.prop('value', '')
    })
    switchDollar.change(() => {
        if (switchDollar.is(':checked')) {
            searchPriceMin.prop('placeholder', 'U$S Desde')
            searchPriceMax.prop('placeholder', 'U$S Hasta')
            searchIsDollar.prop('value', true)
        } else {
            searchPriceMin.prop('placeholder', '$ Desde')
            searchPriceMax.prop('placeholder', '$ Hasta')
            searchIsDollar.prop('value', '')
        }
    })
    if (switchDollar.is(':checked')) {
        searchPriceMin.prop('placeholder', 'U$S Desde')
        searchPriceMax.prop('placeholder', 'U$S Hasta')
        searchIsDollar.prop('value', true)
    }

    let searchAreaMin = $("#input-area-min")
    let searchAreaMax = $("#input-area-max")
    let searchIsHectare = $("#is-hectare")
    let searchIsCoveredArea = $("#covered-area")
    let refreshArea = $("#refresh-area")
    let switchArea = $("#area-switch")
    let switchHectare = $("#hectare-switch")
    let titleArea = $("#filter-area-title")
    refreshArea.click(() => {
        searchAreaMin.prop('value', '')
        searchAreaMax.prop('value', '')
        switchArea.prop('checked', false)
        searchIsCoveredArea.prop('value', '')
        switchHectare.prop('checked', false)
        searchIsHectare.prop('value', '')
        switchArea.prop('disabled', false)
    })
    switchHectare.change(() => {
        if (switchHectare.is(':checked')) {
            searchAreaMin.prop('placeholder', 'Ha Desde')
            searchAreaMax.prop('placeholder', 'Ha Hasta')
            searchIsHectare.prop('value', true)
            if (switchArea.is(':checked')) {
                switchArea.prop('checked', false)
                titleArea.text('Superficie total')
                searchIsCoveredArea.prop('value', '')
            }
            switchArea.prop('disabled', true)
        } else {
            searchAreaMin.prop('placeholder', 'm2 Desde')
            searchAreaMax.prop('placeholder', 'm2 Hasta')
            searchIsHectare.prop('value', '')
            searchIsCoveredArea.prop('disabled', false)
            switchArea.prop('disabled', false)
        }
    })
    if (switchHectare.is(':checked')) {
        searchAreaMin.prop('placeholder', 'Ha Desde')
        searchAreaMax.prop('placeholder', 'Ha Hasta')
        searchIsHectare.prop('value', true)
        switchArea.prop('disabled', true)
    }
    switchArea.change(() => {
        if (switchArea.is(':checked')) {
            titleArea.text('Superficie cubierta')
            searchIsCoveredArea.prop('value', true)
        } else {
            titleArea.text('Superficie total')
            searchIsCoveredArea.prop('value', '')
        }
    })
    if (switchArea.is(':checked')) {
        titleArea.text('Superficie cubierta')
        searchIsCoveredArea.prop('value', true)
    }

    let inputServices = $("#search-services")
    let inputServiceValue = inputServices.prop('value')
    let searchServices = []
    if (inputServiceValue && inputServiceValue !== '') {
        if (inputServiceValue.indexOf(',') < 0) {
            searchServices.push(inputServiceValue)
        }
        searchServices = inputServiceValue.split(',')
    } else {
        searchServices = []
    }
    let btnServicesOne = $("#btn-services-1")
    let btnServicesTwo = $("#btn-services-2")
    let btnServicesThree = $("#btn-services-3")
    let btnServicesFour = $("#btn-services-4")
    let btnServicesFive = $("#btn-services-5")
    let btnServicesSix = $("#btn-services-6")
    let refreshServices = $("#refresh-services")
    const removeItem = (arr, item) => {
        var i = arr.indexOf(item);
        i !== -1 && arr.splice(i, 1);
    };
    btnServicesOne.click(() => {
        if (btnServicesOne.hasClass('text-white')) {
            removeItem(searchServices, btnServicesOne.text().trim())
            btnServicesOne.removeClass('bg-gradient-custom-primary text-white')
        } else {
            searchServices.push(btnServicesOne.text().trim())
            btnServicesOne.addClass('bg-gradient-custom-primary text-white')
        }
        inputServices.prop('value', searchServices.join(','))
    })
    btnServicesTwo.click(() => {
        if (btnServicesTwo.hasClass('text-white')) {
            removeItem(searchServices, btnServicesTwo.text().trim())
            btnServicesTwo.removeClass('bg-gradient-custom-primary text-white')
        } else {
            searchServices.push(btnServicesTwo.text().trim())
            btnServicesTwo.addClass('bg-gradient-custom-primary text-white')
        }
        inputServices.prop('value', searchServices.join(','))
    })
    btnServicesThree.click(() => {
        if (btnServicesThree.hasClass('text-white')) {
            removeItem(searchServices, btnServicesThree.text().trim())
            btnServicesThree.removeClass('bg-gradient-custom-primary text-white')
        } else {
            searchServices.push(btnServicesThree.text().trim())
            btnServicesThree.addClass('bg-gradient-custom-primary text-white')
        }
        inputServices.prop('value', searchServices.join(','))
    })
    btnServicesFour.click(() => {
        if (btnServicesFour.hasClass('text-white')) {
            removeItem(searchServices, btnServicesFour.text().trim())
            btnServicesFour.removeClass('bg-gradient-custom-primary text-white')
        } else {
            searchServices.push(btnServicesFour.text().trim())
            btnServicesFour.addClass('bg-gradient-custom-primary text-white')
        }
        inputServices.prop('value', searchServices.join(','))
    })
    btnServicesFive.click(() => {
        if (btnServicesFive.hasClass('text-white')) {
            removeItem(searchServices, btnServicesFive.text().trim())
            btnServicesFive.removeClass('bg-gradient-custom-primary text-white')
        } else {
            searchServices.push(btnServicesFive.text().trim())
            btnServicesFive.addClass('bg-gradient-custom-primary text-white')
        }
        inputServices.prop('value', searchServices.join(','))
    })
    btnServicesSix.click(() => {
        if (btnServicesSix.hasClass('text-white')) {
            removeItem(searchServices, btnServicesSix.text().trim())
            btnServicesSix.removeClass('bg-gradient-custom-primary text-white')
        } else {
            searchServices.push(btnServicesSix.text().trim())
            btnServicesSix.addClass('bg-gradient-custom-primary text-white')
        }
        inputServices.prop('value', searchServices.join(','))
    })
    refreshServices.click(() => {
        $(".filter-services .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        inputServices.prop('value', '')
        searchServices = []
    })

    let searchNeighborhood = $("#search-neighborhood")
    let btnNeighborhoodOne = $("#btn-neighborhood-1")
    let btnNeighborhoodTwo = $("#btn-neighborhood-2")
    let btnNeighborhoodThree = $("#btn-neighborhood-3")
    let refreshNeighborhood = $("#refresh-neighborhood")
    btnNeighborhoodOne.click(() => {
        $(".filter-neighborhood .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchNeighborhood.prop('value', btnNeighborhoodOne.text().trim())
        btnNeighborhoodOne.addClass('bg-gradient-custom-primary text-white')
    })
    btnNeighborhoodTwo.click(() => {
        $(".filter-neighborhood .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchNeighborhood.prop('value', btnNeighborhoodTwo.text().trim())
        btnNeighborhoodTwo.addClass('bg-gradient-custom-primary text-white')
    })
    btnNeighborhoodThree.click(() => {
        $(".filter-neighborhood .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchNeighborhood.prop('value', btnNeighborhoodThree.text().trim())
        btnNeighborhoodThree.addClass('bg-gradient-custom-primary text-white')
    })
    refreshNeighborhood.click(() => {
        $(".filter-neighborhood .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchNeighborhood.prop('value', '')
    })

    let searchExpenses = $("#search-expenses")
    let btnExpensesOne = $("#btn-expenses-1")
    let btnExpensesTwo = $("#btn-expenses-2")
    let refreshExpenses = $("#refresh-expenses")
    btnExpensesOne.click(() => {
        $(".filter-expenses .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchExpenses.prop('value', btnExpensesOne.text().trim())
        btnExpensesOne.addClass('bg-gradient-custom-primary text-white')
    })
    btnExpensesTwo.click(() => {
        $(".filter-expenses .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchExpenses.prop('value', btnExpensesTwo.text().trim())
        btnExpensesTwo.addClass('bg-gradient-custom-primary text-white')
    })
    refreshExpenses.click(() => {
        $(".filter-expenses .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchExpenses.prop('value', '')
    })

    $("#refresh-filters").click(() => {
        $(".filter-operation .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchOperation.prop('value', '')

        $("#input-type").prop('value', '')

        $("#input-province").prop('value', '')

        $("#input-city").prop('value', '')

        $(".filter-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        $(".search-bedrooms .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchBedrooms.prop('value', '')
        switchBedrooms.prop('checked', false)
        searchBedroomsExact.prop('value', '')

        $("#input-price-min").prop('value', '')
        $("#input-price-max").prop('value', '')
        switchDollar.prop('checked', false)
        searchIsDollar.prop('value', '')

        $("#input-area-min").prop('value', '')
        $("#input-area-max").prop('value', '')
        switchArea.prop('checked', false)
        searchIsCoveredArea.prop('value', '')
        switchHectare.prop('checked', false)
        searchIsHectare.prop('value', '')
        switchArea.prop('disabled', false)

        $(".filter-services .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        inputServices.prop('value', '')
        searchServices = []

        $(".filter-neighborhood .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchNeighborhood.prop('value', '')

        $(".filter-expenses .btn-filter").removeClass('bg-gradient-custom-primary text-white')
        searchExpenses.prop('value', '')

    })

    $("#collapse-filters").click(() => {
        $("#filters").toggle({ duration: 400, easing: 'swing' })
    })

    let featuredPropertiesSection = $("#featured-properties-section")
    let customPropertiesSection = $("#custom-properties-section")
    let latestPropertiesSection = $("#latest-properties-section")
    $(document).ready(() => {
        function shakeElements() {
            $('#float-button-sm, #float-button-lg')
                .effect("shake", { direction: 'up', times: 1, distance: 3 }, 2000)
        }
        setInterval(shakeElements, 2001);

        if ($("#btn-filters-submit-md")) {
            const shakeFilter = () => {
                $("#btn-filters-submit-md").effect("shake", { times: 1, distance: 10 }, 1100)
            }
            setInterval(shakeFilter, 1100);
        }

        if (screen.width < 767) {
            $("#filters").hide()
        }


        $("#modal-client-msg").modal("show");
    })

    $(window).scroll(function () {
        var fix = $('.nav-fix')
        var aux = $('.nav-aux')
        var icons = $('.nav-contact-icons')
        scroll = $(window).scrollTop();

        if (scroll >= 40) {
            if (screen.width > 991) {
                fix.addClass('fixed');
                fix.removeClass('py-lg-5');
                fix.removeClass('py-3');
                aux.addClass('d-flex');
                aux.removeClass('d-none');
                icons.addClass('d-flex');
                icons.removeClass('d-none');
            }
        }
        else {
            fix.removeClass('fixed');
            fix.addClass('py-lg-5');
            aux.removeClass('d-flex');
            aux.addClass('d-none');
            icons.removeClass('d-flex');
            icons.addClass('d-none');
        }
    });

    /* $(window).on('scroll', () => {
        let top = $(this).scrollTop() / 450
        $('#icon-banner-owners').css('transform', 'scale(' + top + ', ' + top + ') rotate(-' + top * 5 + 'deg)')
        $('#icon-banner-wa').css('transform', 'scale(' + top + ', ' + top + ')')
    }) */
})
