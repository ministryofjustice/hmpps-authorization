workspace {

    model {
        
        prisonUser = person " Prison Staff User" "Someone who needs access to prisoner information to carry out their duties"

        probationUser = person " Probation Staff User" "Someone who needs access to prisoner information to carry out their duties in probation"

        externalUser = person " External User" "Someone who needs access to prisoner information from an agency e.g. the police, NHS or other agency"

        AdminUser = person "Admin User" "A user that administrates HMPPS auth"

        DOM1 = person "DOM1 Login User"{
            tags "external system", "Azure"
            prisonUser -> DOM1 "is a"
            probationUser -> DOM1 "is a"
        }

        ExternalUsers = softwareSystem "External Users"{
            ExternalUsersApi = container "External Users API" {
                tags "Existing"
            }
        }

        GovNotify = softwareSystem "Gov Notify" {
            tags "external system", "Mail"
        }


        NOMIS = softwareSystem "NOMIS Prison System" {
            tags "Legacy System"
            NOMISUserRolesAPI = container "NOMIS User Roles API"
            NOMISdatabase = container "NOMIS Database"
            NOMISUserRolesAPI -> NOMISdatabase "reads / writes"
        }


        Delius = softwareSystem "Delius Systems" {
            tags "Legacy System"
            HMPPSManageUsersDeliusApi = container "HMPPS Manage User to delius API"
            NDelius = container "NDelius"
            
            HMPPSManageUsersDeliusApi -> NDelius "gets user info from"
        }

        HMPPSManageUsers = softwareSystem "HMPPS Manage Users" {
            tags "HMPPS Digital Service"
            HMPPSManageUsersApi = container "Manage Users API" {
                tags "Existing"
            }

            HMPPSManageUsersUi = container "Manage Users UI" {
                tags "Existing"
            }
            
            HMPPSManageUsersUi -> HMPPSManageUsersApi "connects to"
            HMPPSManageUsersApi -> NOMISUserRolesAPI "gets NOMIS users and roles"
            HMPPSManageUsersApi -> ExternalUsersApi "gets external users and roles"
            HMPPSManageUsersApi -> HMPPSManageUsersDeliusApi "gets Delius users and roles"
            HMPPSManageUsers -> GovNotify
        }


        HMPPSAuth = softwareSystem "HMPPS Auth" "Authentication and Authorization server"{
            tags "HMPPS Digital Service"

            HMPPSAuthorizationServer = container "HMPPS Authorization Server" { 
                tags "New" 
            }

            HMPPSAuthorizationUI = container "HMPPS Authorization UI"{
                tags "New"
            }
            
            HMPPSLegacyAuth = container "HMPPS Legacy auth service" {
                tags "Existing"
            }
            tokenVerificationAPI = container "Token Verification API"{
                tags "Existing"
            }

            HMPPSLegacyAuth -> HMPPSAuthorizationServer "Proxies"
            HMPPSAuthorizationUI -> HMPPSAuthorizationServer "gets client credential info from"
            HMPPSAuthorizationServer -> HMPPSManageUsersApi "gets user roles"
            HMPPSLegacyAuth -> HMPPSManageUsersApi "gets user roles"
            HMPPSLegacyAuth -> GovNotify "Notifies users"
            HMPPSLegacyAuth -> tokenVerificationAPI
            prisonUser -> HMPPSLegacyAuth "Logs in"
            DOM1 -> HMPPSLegacyAuth "Logs in"
            probationUser -> HMPPSLegacyAuth "Logs in"
            externalUser -> HMPPSLegacyAuth "Logs in"
            AdminUser -> HMPPSAuthorizationUI "administers"
        }

        HMPPSDigitalServices = softwareSystem "HMPPS Digital Services"{
            tags "HMPPS Digital Service" 
            HMPPSDigitalService = container "general HMPPS Digital Service"
            HMPPSDigitalService -> tokenVerificationAPI "verifies tokens"
        }
        
        HMPPSAuth -> HMPPSManageUsers "Gets user and role information from"
        HMPPSDigitalServices -> HMPPSAuth "checks authentication"
        HMPPSDigitalServices -> HMPPSManageUsers "checks user roles"

    }

    views {

        systemLandscape  "HmppsAuthLandscape" {
            include *
        }

        container HMPPSAuth "HMPPSAuth" {
            include *
        }

        container HMPPSDigitalServices "DigitalServices" {
            include *
        }

        container NOMIS "NOMIS"{
            include *
         }

        container Delius "Delius"{
            include *
        }

         container ExternalUsers "ExternalUsers" {
            include *
         }

         container HMPPSManageUsers "ManageUsers"{
            include *
         }

        styles {

            element "Software System" {
                background #1168bd
                color #ffffff
            }

            element "Legacy System" {
                background #cccccc
                color #000000
            }
            element "Existing"{
                background #bbbbff
                color #000000
            }  
            element "External System" {
                background #3598EE
                color #000000
            }             
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }

            element "Azure" {
                icon "AzureAD.png"
                opacity 100
                strokeWidth 3
                color black
                background #c2d8ed
                stroke black
            }

           element "Mail"{
                icon "email.png"
                opacity 100
                strokeWidth 3
                background white
                color black
                stroke black
            }

            element "New"{
                background lightgreen
                border dashed
                strokeWidth 5
                stroke black
            }
        }
    }
    
}