interface BaseNotification {
  type: string;
  created: Date;
  unread: boolean;
}

export interface MessageNotification extends BaseNotification {
  type: 'message';
  author: string;
  subject: string;
  message: string;
}

export interface AttackedNotification extends BaseNotification {
  type: 'attacked';
  province: number;
  nation: number;
  casualties: {
    self: number;
    foe: number;
  };
}

export type Notification = MessageNotification | AttackedNotification;
