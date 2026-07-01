#include<stdio.h>
struct data{
    int num[20];
    int pass[10];
    int c_score;
    int net_amt;

};

int main(){

    int tries=3;
    int i=0 ; 
    struct data d1[50];

    printf("Aldready have an account ? (y/n) : ");
    char choice;
    scanf(" %c",&choice);

  if (choice=='y'){

    printf("Account number :");
    scanf("%d",&d1[i].num);
    printf("Password :");
    scanf("%d",&d1[i].pass);

for(int i=0;i<3;i++){
    if(d1[i].num==d1[i].num && d1[i].pass==d1[i].pass){
        printf("Login successful\n");
        break;
    }
    else{
        printf("Invalid account number or password, please try again\n");
        tries--;
        if(tries==0){
            printf("You have exceeded the maximum number of tries, please try again later\n");
            return 0;
        }
    }
    
            }
        printf("Enter credit score:");
    scanf("%d",&d1[i].c_score);
        }

    else if(choice=='n'){
        printf("Enter account number :");
        scanf("%d",&d1[i].num);
        printf("Enter password :");
        scanf("%d",&d1[i].pass);
        printf("Enter credit score:");
        scanf("%d",&d1[i].c_score);
    }


     // portal enters 

     
    printf("===Welcome===\n");

    printf("Acount number : %d\n",d1[i].num);
    char c;
    if(d1[i].c_score<600){
        printf("Your credit score is low, you are not eligible for any service\n");
        return 0;
    }
    else{
        
    do{
        printf("What service you want to use :\n");
        printf("1. Check balance\n");
        printf("2. Withdraw\n");
        printf("3. Deposit\n");
        printf("4. Exit\n");
        printf("Enter your choice :");
        scanf(" %c",&c);

    switch(c){
        case '1':
         d1[i].net_amt=0;
            printf("Your balance is : %d\n",d1[i].net_amt);
            break;

        case '2':
            int withdraw_amt;
            if(d1[i].net_amt==0){
                printf("Your balance is zero, you cannot withdraw , please deposit first\n");
                break;
            }
            else{
            printf("Enter amount to be  withdrawn :");
            scanf("%d",&withdraw_amt);
            if(withdraw_amt>d1[i].net_amt){
                printf("You cannot withdraw more than your balance\n");
                break;
            }
            if(withdraw_amt<0){
                printf("You cannot withdraw negative amount\n");
                break;
            }
            d1[i].net_amt=d1[i].net_amt-withdraw_amt;
            printf("Your balance is : %d\n",d1[i].net_amt);
            break;
            }

        case '3':
            int deposit_amt;
            printf("Enter amount to be deposited :");
            scanf("%d",&deposit_amt);
            d1[i].net_amt=d1[i].net_amt+deposit_amt;
            printf("Your balance is : %d\n",d1[i].net_amt);
            break;
    }

    }while(c!='4');
    i+=1;
    
  // if exited again show portal page ;
}
}

// More Correct version is given below {ai}
/*
#include<stdio.h>

struct data{
    int num;
    int pass;
    int c_score;
    int net_amt;
};

int main(){

    struct data d1[50];
    int account_count = 0;   // how many accounts exist so far
    char again;

    do{
        int tries = 3;
        int i = -1;          // index of the account we're about to use

        printf("Aldready have an account ? (y/n) : ");
        char choice;
        scanf(" %c", &choice);

        if (choice == 'y'){

            int num_in, pass_in;
            int found = 0;

            while (tries > 0 && !found){
                printf("Account number :");
                scanf("%d", &num_in);
                printf("Password :");
                scanf("%d", &pass_in);

                for (int j = 0; j < account_count; j++){
                    if (d1[j].num == num_in && d1[j].pass == pass_in){
                        printf("Login successful\n");
                        found = 1;
                        i = j;
                        break;
                    }
                }

                if (!found){
                    tries--;
                    if (tries == 0){
                        printf("You have exceeded the maximum number of tries, please try again later\n");
                        break;
                    }
                    printf("Invalid account number or password, please try again\n");
                }
            }

            if (!found){
                // used up all tries, send back to portal
                continue;
            }
        }
        else if (choice == 'n'){
            i = account_count;
            printf("Enter account number :");
            scanf("%d", &d1[i].num);
            printf("Enter password :");
            scanf("%d", &d1[i].pass);
            printf("Enter credit score:");
            scanf("%d", &d1[i].c_score);
            d1[i].net_amt = 0;   // every new account starts at zero balance
            account_count++;
        }
        else{
            printf("Please enter 'y' or 'n'\n");
            continue;
        }

        // ------------ portal enters ------------

        printf("===Welcome===\n");
        printf("Account number : %d\n", d1[i].num);

        char c;
        if (d1[i].c_score < 600){
            printf("Your credit score is low, you are not eligible for any service\n");
        }
        else{
            do{
                printf("What service you want to use :\n");
                printf("1. Check balance\n");
                printf("2. Withdraw\n");
                printf("3. Deposit\n");
                printf("4. Exit\n");
                printf("Enter your choice :");
                scanf(" %c", &c);

                switch(c){
                    case '1':
                        printf("Your balance is : %d\n", d1[i].net_amt);
                        break;

                    case '2': {
                        int withdraw_amt;
                        if (d1[i].net_amt == 0){
                            printf("Your balance is zero, you cannot withdraw , please deposit first\n");
                            break;
                        }
                        printf("Enter amount to be  withdrawn :");
                        scanf("%d", &withdraw_amt);
                        if (withdraw_amt < 0){
                            printf("You cannot withdraw negative amount\n");
                            break;
                        }
                        if (withdraw_amt > d1[i].net_amt){
                            printf("You cannot withdraw more than your balance\n");
                            break;
                        }
                        d1[i].net_amt = d1[i].net_amt - withdraw_amt;
                        printf("Your balance is : %d\n", d1[i].net_amt);
                        break;
                    }

                    case '3': {
                        int deposit_amt;
                        printf("Enter amount to be deposited :");
                        scanf("%d", &deposit_amt);
                        if (deposit_amt < 0){
                            printf("You cannot deposit negative amount\n");
                            break;
                        }
                        d1[i].net_amt = d1[i].net_amt + deposit_amt;
                        printf("Your balance is : %d\n", d1[i].net_amt);
                        break;
                    }

                    case '4':
                        break;

                    default:
                        printf("Please enter a valid choice (1-4)\n");
                }

            } while (c != '4');
        }

        printf("\nReturning to portal...\n\n");
        printf("Go back to portal? (y/n) : ");
        scanf(" %c", &again);

    } while (again == 'y');

    printf("Goodbye!\n");
    return 0;
}
*/
