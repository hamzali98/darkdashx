export interface User {
      id: string,
      status: boolean,
      personal_info: {
        user_name: string,
        user_email: string,
        user_photo: string,
        user_desc: string,
      },
      basic_info: {
        user_phone: string,
        user_position: string,
        user_location: string,
        user_website: string,
      },
      team_info: {
        team_name: string,
        team_rank: string,
        team_office: string,
        team_mail: string,
      }
}
