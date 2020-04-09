
package tech.hexify.foodtopia;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.TaskExecutors;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthProvider;

import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class VerifyPhoneNum extends ReactContextBaseJavaModule
{
    //private static ReactApplicationContext reactContext;
    private String verificationID = null;
    private FirebaseAuth auth;

    VerifyPhoneNum(ReactApplicationContext context)
    {
        super(context);
        //reactContext = context;
        FirebaseApp.initializeApp(context);
        auth = FirebaseAuth.getInstance();
        auth.setLanguageCode(Locale.getDefault().getLanguage());
    }

    @Override
    @NonNull
    public String getName()
    {
        return "VerifyPhoneNum";
    }

    @ReactMethod
    public void sendOTP(String phoneNumber, Callback callback)
    {
        PhoneAuthProvider.getInstance(auth).verifyPhoneNumber(
                "+91" + phoneNumber, 60,
                TimeUnit.SECONDS,
                TaskExecutors.MAIN_THREAD,
                new PhoneAuthProvider.OnVerificationStateChangedCallbacks()
                {
                    @Override
                    public void onVerificationCompleted(@NonNull PhoneAuthCredential phoneAuthCredential)
                    {
                        String code = phoneAuthCredential.getSmsCode();
                        if (code != null)
                            callback.invoke("OTP_DETECTED", code);
                        else
                            callback.invoke("OTP_SENT");
                    }

                    @Override
                    public void onVerificationFailed(@NonNull FirebaseException e)
                    {
                        callback.invoke("OTP_FAILED");
                    }

                    @Override
                    public void onCodeSent(@NonNull String s, @NonNull PhoneAuthProvider.ForceResendingToken forceResendingToken)
                    {
                        super.onCodeSent(s, forceResendingToken);
                        verificationID = s;
                    }
                });
    }

    @ReactMethod
    public void verifyOTP(String otp, Callback callback)
    {
        try
        {
            auth.signInWithCredential(PhoneAuthProvider.getCredential(verificationID, otp))
                    .addOnCompleteListener(TaskExecutors.MAIN_THREAD, new OnCompleteListener<AuthResult>()
                    {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task)
                        {
                            if (task.isSuccessful())
                                callback.invoke("VERIFICATION_SUCCESS");
                            else
                                callback.invoke("VERIFICATION_FAILED");
                        }
                    });

        } catch (Exception ex)
        {
            callback.invoke("ERROR");
        }
    }

    @ReactMethod
    public void signOut()
    {
        auth.signOut();
    }
}