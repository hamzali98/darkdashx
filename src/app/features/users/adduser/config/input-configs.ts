import { inject, Inject } from "@angular/core";
import { CustomInputConfig } from "@app/shared/components/generic-input/generic-input";
import { ListService } from "@app/shared/services/list-service/list-service";

export class InputConfigs {

    private listService = inject(ListService);

    userNameConfig: CustomInputConfig = {
        ngclass: 'pt-0 border-b border-b-gray-500/20',
        type: 'text',
        required: true,
        label: 'FULL_NAME',
        labelFor: 'name',
        labelIcon: 'assets/icons/white/usericon.svg',
        placeholder: 'ENTER_FULL_NAME',
        inputId: 'name',
        inputName: 'name',
        errorMessage: 'NAME_REQUIRED',
    };
    userEmailConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-b-gray-500/20',
        type: 'email',
        required: true,
        label: 'EMAIL',
        labelFor: 'email',
        labelIcon: 'assets/icons/white/email.svg',
        placeholder: 'ENTER_EMAIL',
        inputId: 'email',
        inputName: 'email',
        errorMessage: 'EMAIL_REQUIRED',
        errorMessage2: 'EMAIL_INVALID!'
    };
    userDescConfig: CustomInputConfig = {
        ngclass: 'pt-6',
        type: 'text',
        required: true,
        label: 'SHORT_DESC',
        labelFor: 'desc',
        labelIcon: 'assets/icons/white/pencil.svg',
        placeholder: 'SHORT_DESC_PLACEHOLDER',
        inputId: 'desc',
        inputName: 'desc',
        errorMessage: 'DESCRIPTION_REQUIRED',
    };
    userPhoneConfig: CustomInputConfig = {
        ngclass: 'pt-0 border-b border-b-gray-500/20',
        type: 'tel',
        required: true,
        label: 'Phone',
        labelFor: 'phone',
        labelIcon: 'assets/icons/white/phone.svg',
        placeholder: 'Enter Phone',
        inputId: 'phone',
        inputName: 'phone',
        errorMessage: 'Phone Required!',
        errorMessage2: 'Phone Invalid!',
    };
    userPositionConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-b-gray-500/20',
        type: 'text',
        required: true,
        label: 'Position',
        labelFor: 'position',
        labelIcon: 'assets/icons/white/bag.svg',
        placeholder: 'Enter Position',
        inputId: 'position',
        inputName: 'position',
        errorMessage: 'Position Required!',
    };
    userLocationConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-b-gray-500/20',
        type: 'text',
        required: true,
        label: 'Location',
        labelFor: 'location',
        labelIcon: 'assets/icons/white/location.svg',
        placeholder: 'Enter Location',
        inputId: 'location',
        inputName: 'location',
        errorMessage: 'Location Required!',
    };
    userWebsiteConfig: CustomInputConfig = {
        ngclass: 'pt-6',
        type: 'text',
        required: true,
        label: 'Website',
        labelFor: 'website',
        labelIcon: 'assets/icons/white/internet.svg',
        placeholder: 'Enter Website',
        inputId: 'website',
        inputName: 'website',
        errorMessage: 'Website Required!',
        errorMessage2: 'Website Invalid!'
    };
    userTeamNameConfig: CustomInputConfig = {
        ngclass: 'pt-0 border-b border-b-gray-500/20',
        type: 'select',
        required: true,
        label: 'Team Name',
        labelFor: 'teamname',
        labelIcon: 'assets/icons/white/team.svg',
        placeholder: 'Select Team',
        inputId: 'teamname',
        inputName: 'teamname',
        errorMessage: 'Team Name Required!',
        selectOptions: this.listService.getCompanyList(),
    };
    userTeamRankConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-b-gray-500/20',
        type: 'text',
        required: true,
        label: 'Rank',
        labelFor: 'rank',
        labelIcon: 'assets/icons/white/rank.svg',
        placeholder: 'Enter Team Rank',
        inputId: 'rank',
        inputName: 'rank',
        errorMessage: 'Team Rank Required!',
    };
    userTeamOfficeConfig: CustomInputConfig = {
        ngclass: 'pt-6 border-b border-b-gray-500/20',
        type: 'text',
        required: true,
        label: 'Office',
        labelFor: 'office',
        labelIcon: 'assets/icons/white/location.svg',
        placeholder: 'Enter Team Office',
        inputId: 'office',
        inputName: 'office',
        errorMessage: 'Team Office Required!',
    };
    userTeamEmailConfig: CustomInputConfig = {
        ngclass: 'pt-6',
        type: 'email',
        required: true,
        label: 'Email',
        labelFor: 'mail',
        labelIcon: 'assets/icons/white/pencil.svg',
        placeholder: 'Enter Team mail',
        inputId: 'mail',
        inputName: 'mail',
        errorMessage: 'Team Mail Required!',
        errorMessage2: 'Team Mail Not Valid!'
    };
}